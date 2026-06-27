import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressResponseDto } from '../dto/address-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const ADDRESS_SERVICE = Symbol('ADDRESS_SERVICE');

export interface IAddressService {
  findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<AddressResponseDto>>;
  findById(id: string): Promise<AddressResponseDto>;
  findByCustomerId(customerId: string): Promise<AddressResponseDto[]>;
  create(dto: CreateAddressDto): Promise<AddressResponseDto>;
  update(id: string, dto: UpdateAddressDto): Promise<AddressResponseDto>;
  remove(id: string): Promise<void>;
}
