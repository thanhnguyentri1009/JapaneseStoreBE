import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { BrandResponseDto } from '../dto/brand-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const BRAND_SERVICE = Symbol('BRAND_SERVICE');

export interface IBrandService {
  findAll(
    page: number,
    perPage: number,
    searchText?: string,
  ): Promise<PaginatedResult<BrandResponseDto>>;
  findById(id: string): Promise<BrandResponseDto>;
  create(dto: CreateBrandDto): Promise<BrandResponseDto>;
  update(id: string, dto: UpdateBrandDto): Promise<BrandResponseDto>;
  remove(id: string): Promise<void>;
}
