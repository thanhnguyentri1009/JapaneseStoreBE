import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';
import { IOrderService } from './interfaces/order-service.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderGateway } from './order.gateway';
import { MailService } from '../mail/mail.service';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

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

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<OrderResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      relations: ['items', 'payment'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { data: data.map(OrderResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<Order> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'payment', 'address'],
    });
    if (!entity) throw new NotFoundException(`Order #${id} not found`);
    return entity;
  }

  async findById(id: string): Promise<OrderResponseDto> {
    return OrderResponseDto.from(await this.getEntity(id));
  }

  async findByCustomerId(customerId: string): Promise<OrderResponseDto[]> {
    const data = await this.repo.find({
      where: { customerId },
      relations: ['items', 'payment'],
    });
    return data.map(OrderResponseDto.from);
  }

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
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

    return OrderResponseDto.from(order);
  }

  async update(id: string, dto: UpdateOrderDto): Promise<OrderResponseDto> {
    const entity = await this.getEntity(id);
    const result = await this.repo.save({ ...entity, ...dto });
    return OrderResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
  }
}
