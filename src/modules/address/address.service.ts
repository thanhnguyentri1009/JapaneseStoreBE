import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { IAddressService } from './interfaces/address-service.interface';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class AddressService implements IAddressService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectRepository(Address)
    private readonly repo: Repository<Address>,
  ) {}

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<AddressResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { items: data.map(AddressResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<Address> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Address #${id} not found`);
    return entity;
  }

  async findById(id: string): Promise<AddressResponseDto> {
    return AddressResponseDto.from(await this.getEntity(id));
  }

  async findByCustomerId(customerId: string): Promise<AddressResponseDto[]> {
    const data = await this.repo.find({ where: { customerId } });
    return data.map(AddressResponseDto.from);
  }

  async create(dto: CreateAddressDto): Promise<AddressResponseDto> {
    const result = await this.repo.save(this.repo.create(dto));
    return AddressResponseDto.from(result);
  }

  async update(id: string, dto: UpdateAddressDto): Promise<AddressResponseDto> {
    const entity = await this.getEntity(id);
    const result = await this.repo.save({ ...entity, ...dto });
    return AddressResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
  }
}
