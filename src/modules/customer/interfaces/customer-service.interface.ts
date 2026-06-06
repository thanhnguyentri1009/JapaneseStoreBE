import { Customer } from '../../../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

export const CUSTOMER_SERVICE = Symbol('CUSTOMER_SERVICE');

export interface ICustomerService {
  findAll(): Promise<Customer[]>;
  findById(id: number): Promise<Customer>;
  findByEmail(email: string): Promise<Customer>;
  create(dto: CreateCustomerDto): Promise<Customer>;
  update(id: number, dto: UpdateCustomerDto): Promise<Customer>;
  remove(id: number): Promise<void>;
}
