import { Category } from '../../../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export const CATEGORY_SERVICE = Symbol('CATEGORY_SERVICE');

export interface ICategoryService {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category>;
  create(dto: CreateCategoryDto): Promise<Category>;
  update(id: number, dto: UpdateCategoryDto): Promise<Category>;
  remove(id: number): Promise<void>;
}
