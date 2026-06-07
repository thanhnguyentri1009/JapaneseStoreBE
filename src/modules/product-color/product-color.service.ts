import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductColor } from '../../entities/product-color.entity';
import { IProductColorService } from './interfaces/product-color-service.interface';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';

@Injectable()
export class ProductColorService implements IProductColorService {
  private readonly logger = new Logger(ProductColorService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(ProductColor)
    private readonly repo: Repository<ProductColor>,
  ) {}

  async findAll(): Promise<ProductColor[]> {
    try {
      const cached = await this.cache.get<ProductColor[]>('product-colors');
      if (cached) return cached;
    } catch (error) {
      this.logger.error('Cache get failed for product-colors', error);
    }

    const data = await this.repo.find();

    try {
      await this.cache.set('product-colors', data);
    } catch (error) {
      this.logger.error('Cache set failed for product-colors', error);
    }

    return data;
  }

  async findById(id: string): Promise<ProductColor> {
    try {
      const cached = await this.cache.get<ProductColor>(`product-color:${id}`);
      if (cached) return cached;
    } catch (error) {
      this.logger.error(`Cache get failed for product-color:${id}`, error);
    }

    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ProductColor #${id} not found`);

    try {
      await this.cache.set(`product-color:${id}`, entity);
    } catch (error) {
      this.logger.error(`Cache set failed for product-color:${id}`, error);
    }

    return entity;
  }

  async findByProductId(productId: string): Promise<ProductColor[]> {
    try {
      const cached = await this.cache.get<ProductColor[]>(
        `product-colors:product:${productId}`,
      );
      if (cached) return cached;
    } catch (error) {
      this.logger.error(
        `Cache get failed for product-colors:product:${productId}`,
        error,
      );
    }

    const data = await this.repo.find({ where: { productId } });

    try {
      await this.cache.set(`product-colors:product:${productId}`, data);
    } catch (error) {
      this.logger.error(
        `Cache set failed for product-colors:product:${productId}`,
        error,
      );
    }

    return data;
  }

  async create(dto: CreateProductColorDto): Promise<ProductColor> {
    const result = await this.repo.save(this.repo.create(dto));
    try {
      await this.cache.del('product-colors');
      if (dto.productId)
        await this.cache.del(`product-colors:product:${dto.productId}`);
    } catch (error) {
      this.logger.error('Cache del failed after product-color create', error);
    }
    return result;
  }

  async update(id: string, dto: UpdateProductColorDto): Promise<ProductColor> {
    const entity = await this.findById(id);
    const result = await this.repo.save({ ...entity, ...dto });
    try {
      await this.cache.del('product-colors');
      await this.cache.del(`product-color:${id}`);
      if (entity.productId)
        await this.cache.del(`product-colors:product:${entity.productId}`);
    } catch (error) {
      this.logger.error(
        `Cache del failed after product-color:${id} update`,
        error,
      );
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
    try {
      await this.cache.del('product-colors');
      await this.cache.del(`product-color:${id}`);
      if (entity.productId)
        await this.cache.del(`product-colors:product:${entity.productId}`);
    } catch (error) {
      this.logger.error(
        `Cache del failed after product-color:${id} remove`,
        error,
      );
    }
  }
}
