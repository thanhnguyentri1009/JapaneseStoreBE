import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import { IProductService } from './interfaces/product-service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

const RELATIONS = ['category', 'brand', 'detail'];

@Injectable()
export class ProductService implements IProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    @InjectRepository(ProductDetail)
    private readonly detailRepo: Repository<ProductDetail>,
  ) {}

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<ProductResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      relations: RELATIONS,
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { data: data.map(ProductResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<Product> {
    try {
      const cached = await this.cache.get<Product>(`product:${id}`);
      if (cached) return cached;
    } catch (error) {
      this.logger.error(`Cache get failed for product:${id}`, error);
    }

    const entity = await this.repo.findOne({
      where: { id },
      relations: RELATIONS,
    });
    if (!entity) throw new NotFoundException(`Product #${id} not found`);

    try {
      await this.cache.set(`product:${id}`, entity);
    } catch (error) {
      this.logger.error(`Cache set failed for product:${id}`, error);
    }

    return entity;
  }

  async findById(id: string): Promise<ProductResponseDto> {
    return ProductResponseDto.from(await this.getEntity(id));
  }

  async findByCategoryId(categoryId: string): Promise<ProductResponseDto[]> {
    try {
      const cached = await this.cache.get<Product[]>(
        `products:category:${categoryId}`,
      );
      if (cached) return cached.map(ProductResponseDto.from);
    } catch (error) {
      this.logger.error(
        `Cache get failed for products:category:${categoryId}`,
        error,
      );
    }

    const data = await this.repo.find({
      where: { categoryId },
      relations: RELATIONS,
    });

    try {
      await this.cache.set(`products:category:${categoryId}`, data);
    } catch (error) {
      this.logger.error(
        `Cache set failed for products:category:${categoryId}`,
        error,
      );
    }

    return data.map(ProductResponseDto.from);
  }

  async findByBrandId(brandId: string): Promise<ProductResponseDto[]> {
    try {
      const cached = await this.cache.get<Product[]>(
        `products:brand:${brandId}`,
      );
      if (cached) return cached.map(ProductResponseDto.from);
    } catch (error) {
      this.logger.error(
        `Cache get failed for products:brand:${brandId}`,
        error,
      );
    }

    const data = await this.repo.find({
      where: { brandId },
      relations: RELATIONS,
    });

    try {
      await this.cache.set(`products:brand:${brandId}`, data);
    } catch (error) {
      this.logger.error(
        `Cache set failed for products:brand:${brandId}`,
        error,
      );
    }

    return data.map(ProductResponseDto.from);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const { nibType, inkType, colorCount, stock, isActive, ...productFields } =
      dto;
    const product = await this.repo.save(this.repo.create(productFields));
    const detail = await this.detailRepo.save(
      this.detailRepo.create({
        productId: product.id,
        nibType,
        inkType,
        colorCount,
        stock,
        isActive,
      }),
    );
    try {
      await this.cache.del('products');
      if (dto.categoryId)
        await this.cache.del(`products:category:${dto.categoryId}`);
      if (dto.brandId) await this.cache.del(`products:brand:${dto.brandId}`);
    } catch (error) {
      this.logger.error('Cache del failed after product create', error);
    }
    return ProductResponseDto.from({ ...product, detail });
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.getEntity(id);
    const { nibType, inkType, colorCount, stock, isActive, ...productFields } =
      dto;

    const product = await this.repo.save({
      ...entity,
      ...productFields,
    });

    const detailChanges = { nibType, inkType, colorCount, stock, isActive };
    const hasDetailChanges = Object.values(detailChanges).some(
      (value) => value !== undefined,
    );
    const detail = hasDetailChanges
      ? await this.detailRepo.save({
          ...(entity.detail ?? { productId: id }),
          ...Object.fromEntries(
            Object.entries(detailChanges).filter(
              ([, value]) => value !== undefined,
            ),
          ),
        })
      : entity.detail;

    try {
      await this.cache.del('products');
      await this.cache.del(`product:${id}`);
      if (entity.categoryId)
        await this.cache.del(`products:category:${entity.categoryId}`);
      if (dto.categoryId && dto.categoryId !== entity.categoryId)
        await this.cache.del(`products:category:${dto.categoryId}`);
      if (entity.brandId)
        await this.cache.del(`products:brand:${entity.brandId}`);
      if (dto.brandId && dto.brandId !== entity.brandId)
        await this.cache.del(`products:brand:${dto.brandId}`);
    } catch (error) {
      this.logger.error(`Cache del failed after product:${id} update`, error);
    }
    return ProductResponseDto.from({ ...product, detail });
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
    try {
      await this.cache.del('products');
      await this.cache.del(`product:${id}`);
      if (entity.categoryId)
        await this.cache.del(`products:category:${entity.categoryId}`);
      if (entity.brandId)
        await this.cache.del(`products:brand:${entity.brandId}`);
    } catch (error) {
      this.logger.error(`Cache del failed after product:${id} remove`, error);
    }
  }
}
