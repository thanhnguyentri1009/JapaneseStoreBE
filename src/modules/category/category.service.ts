import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Category } from '../../entities/category.entity';
import { ICategoryService } from './interfaces/category-service.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService implements ICategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    try {
      const cached = await this.cache.get<Category[]>('categories');
      if (cached) return cached;
    } catch (error) {
      this.logger.error('Cache get failed for categories', error);
    }

    const data = await this.repo.find();

    try {
      await this.cache.set('categories', data);
    } catch (error) {
      this.logger.error('Cache set failed for categories', error);
    }

    return data;
  }

  async findById(id: string): Promise<Category> {
    try {
      const cached = await this.cache.get<Category>(`category:${id}`);
      if (cached) return cached;
    } catch (error) {
      this.logger.error(`Cache get failed for category:${id}`, error);
    }

    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Category #${id} not found`);

    try {
      await this.cache.set(`category:${id}`, entity);
    } catch (error) {
      this.logger.error(`Cache set failed for category:${id}`, error);
    }

    return entity;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const result = await this.repo.save(this.repo.create(dto));
    try {
      await this.cache.del('categories');
    } catch (error) {
      this.logger.error('Cache del failed for categories', error);
    }
    return result;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const entity = await this.findById(id);
    const result = await this.repo.save({ ...entity, ...dto });
    try {
      await this.cache.del('categories');
      await this.cache.del(`category:${id}`);
    } catch (error) {
      this.logger.error(`Cache del failed for category:${id}`, error);
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
    try {
      await this.cache.del('categories');
      await this.cache.del(`category:${id}`);
    } catch (error) {
      this.logger.error(`Cache del failed for category:${id}`, error);
    }
  }
}
