import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { IOrderService } from './interfaces/order-service.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.repo.find({ relations: ['items', 'payment'] });
  }

  async findById(id: number): Promise<Order> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'payment', 'address'],
    });
    if (!entity) throw new NotFoundException(`Order #${id} not found`);
    return entity;
  }

  findByCustomerId(customerId: number): Promise<Order[]> {
    return this.repo.find({ where: { customerId }, relations: ['items', 'payment'] });
  }

  create(dto: CreateOrderDto): Promise<Order> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const entity = await this.findById(id);
    return this.repo.save({ ...entity, ...dto });
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
  }
}
