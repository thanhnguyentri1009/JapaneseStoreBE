import { Brand } from '../../../entities/brand.entity';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';

export const BRAND_SERVICE = Symbol('BRAND_SERVICE');

export interface IBrandService {
  findAll(): Promise<Brand[]>;
  findById(id: string): Promise<Brand>;
  create(dto: CreateBrandDto): Promise<Brand>;
  update(id: string, dto: UpdateBrandDto): Promise<Brand>;
  remove(id: string): Promise<void>;
}
