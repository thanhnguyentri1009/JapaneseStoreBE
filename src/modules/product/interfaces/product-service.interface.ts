import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const PRODUCT_SERVICE = Symbol('PRODUCT_SERVICE');

export interface IProductService {
  findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<ProductResponseDto>>;
  findById(id: string): Promise<ProductResponseDto>;
  findByCategoryId(categoryId: string): Promise<ProductResponseDto[]>;
  findByBrandId(brandId: string): Promise<ProductResponseDto[]>;
  create(dto: CreateProductDto, imageFilename: string): Promise<ProductResponseDto>;
  update(id: string, dto: UpdateProductDto, imageFilename?: string): Promise<ProductResponseDto>;
  remove(id: string): Promise<void>;
}
