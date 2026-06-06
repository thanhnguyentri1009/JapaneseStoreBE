import { ProductColor } from '../../../entities/product-color.entity';
import { CreateProductColorDto } from '../dto/create-product-color.dto';
import { UpdateProductColorDto } from '../dto/update-product-color.dto';

export const PRODUCT_COLOR_SERVICE = Symbol('PRODUCT_COLOR_SERVICE');

export interface IProductColorService {
  findAll(): Promise<ProductColor[]>;
  findById(id: number): Promise<ProductColor>;
  findByProductId(productId: number): Promise<ProductColor[]>;
  create(dto: CreateProductColorDto): Promise<ProductColor>;
  update(id: number, dto: UpdateProductColorDto): Promise<ProductColor>;
  remove(id: number): Promise<void>;
}
