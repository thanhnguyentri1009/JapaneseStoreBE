import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../../entities/brand.entity';
import { IBrandService } from './interfaces/brand-service.interface';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<BrandResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { data: data.map(BrandResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<Brand> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Brand #${id} not found`);
    return entity;
  }

  async findById(id: string): Promise<BrandResponseDto> {
    return BrandResponseDto.from(await this.getEntity(id));
  }

  async create(dto: CreateBrandDto): Promise<BrandResponseDto> {
    const result = await this.repo.save(this.repo.create(dto));
    return BrandResponseDto.from(result);
  }

  async update(id: string, dto: UpdateBrandDto): Promise<BrandResponseDto> {
    const entity = await this.getEntity(id);
    const result = await this.repo.save({ ...entity, ...dto });
    return BrandResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
  }
}
