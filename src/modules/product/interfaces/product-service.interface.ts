import { Product } from '../../../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export const PRODUCT_SERVICE = Symbol('PRODUCT_SERVICE');

export interface IProductService {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: number, dto: UpdateProductDto): Promise<Product>;
  remove(id: number): Promise<void>;
}
