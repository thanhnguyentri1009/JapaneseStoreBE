import { Address } from '../../../entities/address.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

export const ADDRESS_SERVICE = Symbol('ADDRESS_SERVICE');

export interface IAddressService {
  findAll(): Promise<Address[]>;
  findById(id: string): Promise<Address>;
  findByCustomerId(customerId: string): Promise<Address[]>;
  create(dto: CreateAddressDto): Promise<Address>;
  update(id: string, dto: UpdateAddressDto): Promise<Address>;
  remove(id: string): Promise<void>;
}
