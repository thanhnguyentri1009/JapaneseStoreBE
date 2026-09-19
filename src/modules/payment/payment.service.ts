import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { Customer } from '../../entities/customer.entity';
import { IPaymentService } from './interfaces/payment-service.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<PaymentResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { items: data.map(PaymentResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<Payment> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Payment #${id} not found`);
    return entity;
  }

  async findById(id: string): Promise<PaymentResponseDto> {
    return PaymentResponseDto.from(await this.getEntity(id));
  }

  async findByOrderId(orderId: string): Promise<PaymentResponseDto> {
    const entity = await this.repo.findOne({ where: { orderId } });
    if (!entity)
      throw new NotFoundException(`Payment for Order #${orderId} not found`);
    return PaymentResponseDto.from(entity);
  }

  private async resolveOwnCustomerId(
    accountId: string,
  ): Promise<string | null> {
    const customer = await this.customerRepo.findOne({
      where: { accountId },
    });
    return customer?.id ?? null;
  }

  async findAllForAccount(
    accountId: string,
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<PaymentResponseDto>> {
    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId) return { items: [], page, perPage, total: 0 };

    const [data, total] = await this.repo.findAndCount({
      where: { order: { customerId } },
      relations: ['order'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { items: data.map(PaymentResponseDto.from), page, perPage, total };
  }

  async findByIdForAccount(
    id: string,
    accountId: string,
  ): Promise<PaymentResponseDto> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!entity) throw new NotFoundException(`Payment #${id} not found`);

    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId || entity.order?.customerId !== customerId) {
      throw new ForbiddenException('You do not have access to this payment');
    }
    return PaymentResponseDto.from(entity);
  }

  async findByOrderIdForAccount(
    orderId: string,
    accountId: string,
  ): Promise<PaymentResponseDto> {
    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId)
      throw new NotFoundException(`Payment for Order #${orderId} not found`);

    const entity = await this.repo.findOne({
      where: { orderId, order: { customerId } },
      relations: ['order'],
    });
    if (!entity)
      throw new NotFoundException(`Payment for Order #${orderId} not found`);
    return PaymentResponseDto.from(entity);
  }

  async create(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const result = await this.repo.save(this.repo.create(dto));
    return PaymentResponseDto.from(result);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    const entity = await this.getEntity(id);
    const result = await this.repo.save({ ...entity, ...dto });
    return PaymentResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
  }
}
