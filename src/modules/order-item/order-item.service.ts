import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { IOrderItemService } from './interfaces/order-item-service.interface';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repo: Repository<OrderItem>,
  ) {}

  findAll(): Promise<OrderItem[]> {
    return this.repo.find({ relations: ['product'] });
  }

  async findById(id: string): Promise<OrderItem> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!entity) throw new NotFoundException(`OrderItem #${id} not found`);
    return entity;
  }

  findByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.repo.find({ where: { orderId }, relations: ['product'] });
  }

  create(dto: CreateOrderItemDto): Promise<OrderItem> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const entity = await this.findById(id);
    return this.repo.save({ ...entity, ...dto });
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
  }
}
