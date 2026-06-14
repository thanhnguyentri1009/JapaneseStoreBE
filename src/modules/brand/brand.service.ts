import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../../entities/brand.entity';
import { IBrandService } from './interfaces/brand-service.interface';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}

  findAll(): Promise<Brand[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Brand> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Brand #${id} not found`);
    return entity;
  }

  create(dto: CreateBrandDto): Promise<Brand> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateBrandDto): Promise<Brand> {
    const entity = await this.findById(id);
    return this.repo.save({ ...entity, ...dto });
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
  }
}
