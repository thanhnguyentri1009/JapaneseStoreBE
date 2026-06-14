import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';
import { IOrderService } from './interfaces/order-service.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderGateway } from './order.gateway';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly gateway: OrderGateway,
    private readonly mailService: MailService,
  ) {}

  findAll(): Promise<Order[]> {
    return this.repo.find({ relations: ['items', 'payment'] });
  }

  async findById(id: string): Promise<Order> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'payment', 'address'],
    });
    if (!entity) throw new NotFoundException(`Order #${id} not found`);
    return entity;
  }

  findByCustomerId(customerId: string): Promise<Order[]> {
    return this.repo.find({
      where: { customerId },
      relations: ['items', 'payment'],
    });
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = await this.repo.save(this.repo.create(dto));

    this.gateway.notifyNewOrder(order);

    if (dto.customerId) {
      const customer = await this.customerRepo.findOne({
        where: { id: dto.customerId },
      });
      if (customer) {
        await this.mailService.sendOrderConfirmation(customer.email, order);
      }
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const entity = await this.findById(id);
    return this.repo.save({ ...entity, ...dto });
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
  }
}
