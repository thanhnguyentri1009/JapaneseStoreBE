import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Category } from '../../entities/category.entity';
import { ICategoryService } from './interfaces/category-service.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<CategoryResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { items: data.map(CategoryResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<Category> {
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

  async findById(id: string): Promise<CategoryResponseDto> {
    return CategoryResponseDto.from(await this.getEntity(id));
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const result = await this.repo.save(this.repo.create(dto));
    try {
      await this.cache.del('categories');
    } catch (error) {
      this.logger.error('Cache del failed for categories', error);
    }
    return CategoryResponseDto.from(result);
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const entity = await this.getEntity(id);
    const result = await this.repo.save({ ...entity, ...dto });
    try {
      await this.cache.del('categories');
      await this.cache.del(`category:${id}`);
    } catch (error) {
      this.logger.error(`Cache del failed for category:${id}`, error);
    }
    return CategoryResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
    try {
      await this.cache.del('categories');
      await this.cache.del(`category:${id}`);
    } catch (error) {
      this.logger.error(`Cache del failed for category:${id}`, error);
    }
  }
}
