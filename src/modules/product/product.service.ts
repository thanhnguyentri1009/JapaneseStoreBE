import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../entities/product.entity';
import { IProductService } from './interfaces/product-service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const RELATIONS = ['category', 'brand'];

@Injectable()
export class ProductService implements IProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    try {
      const cached = await this.cache.get<Product[]>('products');
      if (cached) return cached;
    } catch (error) {
      this.logger.error('Cache get failed for products', error);
    }

    const data = await this.repo.find({ relations: RELATIONS });

    try {
      await this.cache.set('products', data);
    } catch (error) {
      this.logger.error('Cache set failed for products', error);
    }

    return data;
  }

  async findById(id: string): Promise<Product> {
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

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    try {
      const cached = await this.cache.get<Product[]>(
        `products:category:${categoryId}`,
      );
      if (cached) return cached;
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

    return data;
  }

  async findByBrandId(brandId: string): Promise<Product[]> {
    try {
      const cached = await this.cache.get<Product[]>(
        `products:brand:${brandId}`,
      );
      if (cached) return cached;
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

    return data;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const result = await this.repo.save(this.repo.create(dto));
    try {
      await this.cache.del('products');
      if (dto.categoryId)
        await this.cache.del(`products:category:${dto.categoryId}`);
      if (dto.brandId) await this.cache.del(`products:brand:${dto.brandId}`);
    } catch (error) {
      this.logger.error('Cache del failed after product create', error);
    }
    return result;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const entity = await this.findById(id);
    const result = await this.repo.save({ ...entity, ...dto });
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
    return result;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
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
