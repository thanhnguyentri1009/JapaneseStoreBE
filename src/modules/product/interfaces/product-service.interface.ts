import { Product } from '../../../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export const PRODUCT_SERVICE = Symbol('PRODUCT_SERVICE');

export interface IProductService {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findByBrandId(brandId: string): Promise<Product[]>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
}
