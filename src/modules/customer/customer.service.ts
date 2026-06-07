import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Customer } from '../../entities/customer.entity';
import { ICustomerService } from './interfaces/customer-service.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService implements ICustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    try {
      const cached = await this.cache.get<Customer[]>('customers');
      if (cached) return cached;
    } catch (error) {
      this.logger.error('Cache get failed for customers', error);
    }

    const data = await this.repo.find();

    try {
      await this.cache.set('customers', data);
    } catch (error) {
      this.logger.error('Cache set failed for customers', error);
    }

    return data;
  }

  async findById(id: string): Promise<Customer> {
    try {
      const cached = await this.cache.get<Customer>(`customer:${id}`);
      if (cached) return cached;
    } catch (error) {
      this.logger.error(`Cache get failed for customer:${id}`, error);
    }

    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Customer #${id} not found`);

    try {
      await this.cache.set(`customer:${id}`, entity);
    } catch (error) {
      this.logger.error(`Cache set failed for customer:${id}`, error);
    }

    return entity;
  }

  async findByEmail(email: string): Promise<Customer> {
    try {
      const cached = await this.cache.get<Customer>(`customer:email:${email}`);
      if (cached) return cached;
    } catch (error) {
      this.logger.error(`Cache get failed for customer:email:${email}`, error);
    }

    const entity = await this.repo.findOne({ where: { email } });
    if (!entity)
      throw new NotFoundException(`Customer with email "${email}" not found`);

    try {
      await this.cache.set(`customer:email:${email}`, entity);
    } catch (error) {
      this.logger.error(`Cache set failed for customer:email:${email}`, error);
    }

    return entity;
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const result = await this.repo.save(this.repo.create(dto));
    try {
      await this.cache.del('customers');
    } catch (error) {
      this.logger.error('Cache del failed after customer create', error);
    }
    return result;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const entity = await this.findById(id);
    const result = await this.repo.save({ ...entity, ...dto });
    try {
      await this.cache.del('customers');
      await this.cache.del(`customer:${id}`);
      await this.cache.del(`customer:email:${entity.email}`);
      if (dto.email && dto.email !== entity.email) {
        await this.cache.del(`customer:email:${dto.email}`);
      }
    } catch (error) {
      this.logger.error(`Cache del failed after customer:${id} update`, error);
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
    try {
      await this.cache.del('customers');
      await this.cache.del(`customer:${id}`);
      await this.cache.del(`customer:email:${entity.email}`);
    } catch (error) {
      this.logger.error(`Cache del failed after customer:${id} remove`, error);
    }
  }
}
