import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { IPaymentService } from './interfaces/payment-service.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  findAll(): Promise<Payment[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Payment> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Payment #${id} not found`);
    return entity;
  }

  async findByOrderId(orderId: number): Promise<Payment> {
    const entity = await this.repo.findOne({ where: { orderId } });
    if (!entity) throw new NotFoundException(`Payment for Order #${orderId} not found`);
    return entity;
  }

  create(dto: CreatePaymentDto): Promise<Payment> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<Payment> {
    const entity = await this.findById(id);
    return this.repo.save({ ...entity, ...dto });
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
  }
}
