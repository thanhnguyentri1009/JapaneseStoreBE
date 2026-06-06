import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { IAddressService } from './interfaces/address-service.interface';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AddressService implements IAddressService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectRepository(Address)
    private readonly repo: Repository<Address>,
  ) {}

  async findAll(): Promise<Address[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Address> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Address #${id} not found`);
    return entity;
  }

  findByCustomerId(customerId: number): Promise<Address[]> {
    return this.repo.find({ where: { customerId } });
  }

  create(dto: CreateAddressDto): Promise<Address> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Address> {
    const entity = await this.findById(id);
    return this.repo.save({ ...entity, ...dto });
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
  }
}
