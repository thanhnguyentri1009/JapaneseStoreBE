import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const CUSTOMER_SERVICE = Symbol('CUSTOMER_SERVICE');

export interface ICustomerService {
  findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<CustomerResponseDto>>;
  findById(id: string): Promise<CustomerResponseDto>;
  findByEmail(email: string): Promise<CustomerResponseDto>;
  create(dto: CreateCustomerDto): Promise<CustomerResponseDto>;
  update(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto>;
  remove(id: string): Promise<void>;
}
