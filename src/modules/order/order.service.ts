import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
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
    private readonly dataSource: DataSource,
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
    return { items: data.map(OrderResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<Order> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: [
        'items',
        'items.product',
        'items.product.detail',
        'payment',
        'address',
      ],
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
  ): Promise<PaginatedResult<OrderResponseDto>> {
    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId) return { items: [], page, perPage, total: 0 };

    const [data, total] = await this.repo.findAndCount({
      where: { customerId },
      relations: ['items', 'payment'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { items: data.map(OrderResponseDto.from), page, perPage, total };
  }

  async findByIdForAccount(
    id: string,
    accountId: string,
  ): Promise<OrderResponseDto> {
    const entity = await this.getEntity(id);
    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId || entity.customerId !== customerId) {
      throw new ForbiddenException('You do not have access to this order');
    }
    return OrderResponseDto.from(entity);
  }

  async findByCustomerIdForAccount(
    customerId: string,
    accountId: string,
  ): Promise<OrderResponseDto[]> {
    const ownCustomerId = await this.resolveOwnCustomerId(accountId);
    if (!ownCustomerId || customerId !== ownCustomerId) {
      throw new ForbiddenException('You do not have access to these orders');
    }
    return this.findByCustomerId(customerId);
  }

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.repo.save(
      this.repo.create({ ...dto, totalAmount: 0 }),
    );

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

    const isCancelling =
      dto.status === OrderStatus.CANCELLED &&
      entity.status !== OrderStatus.CANCELLED;

    const result = await this.dataSource.transaction(async (manager) => {
      if (isCancelling) {
        for (const item of entity.items ?? []) {
          if (item.product?.detail) {
            item.product.detail.stock += item.quantity;
            await manager.save(item.product.detail);
          }
        }
      }
      return manager.save(Order, { ...entity, ...dto });
    });

    return OrderResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
  }
}
