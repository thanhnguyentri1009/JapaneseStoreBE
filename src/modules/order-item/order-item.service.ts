import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { IOrderItemService } from './interfaces/order-item-service.interface';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
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

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: dto.productId },
      });
      if (!product)
        throw new NotFoundException(`Product #${dto.productId} not found`);
      if (product.stock < dto.quantity)
        throw new BadRequestException(
          `Insufficient stock for product #${dto.productId}`,
        );

      product.stock -= dto.quantity;
      await manager.save(product);

      return manager.save(manager.create(OrderItem, dto));
    });
  }

  // Mirrors C# OrderDetailService.CreateList — bulk create with stock decrement in one transaction
  async createList(dtos: CreateOrderItemDto[]): Promise<OrderItem[]> {
    return this.dataSource.transaction(async (manager) => {
      const results: OrderItem[] = [];

      for (const dto of dtos) {
        const product = await manager.findOne(Product, {
          where: { id: dto.productId },
        });
        if (!product)
          throw new NotFoundException(`Product #${dto.productId} not found`);
        if (product.stock < dto.quantity)
          throw new BadRequestException(
            `Insufficient stock for product #${dto.productId}`,
          );

        product.stock -= dto.quantity;
        await manager.save(product);
        results.push(await manager.save(manager.create(OrderItem, dto)));
      }

      return results;
    });
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
