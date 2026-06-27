import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const CATEGORY_SERVICE = Symbol('CATEGORY_SERVICE');

export interface ICategoryService {
  findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<CategoryResponseDto>>;
  findById(id: string): Promise<CategoryResponseDto>;
  create(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
  update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto>;
  remove(id: string): Promise<void>;
}
