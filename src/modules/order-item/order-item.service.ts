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
import { OrderItemResponseDto } from './dto/order-item-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<OrderItemResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      relations: ['product'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { data: data.map(OrderItemResponseDto.from), page, perPage, total };
  }

  private async getEntity(id: string): Promise<OrderItem> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!entity) throw new NotFoundException(`OrderItem #${id} not found`);
    return entity;
  }

  async findById(id: string): Promise<OrderItemResponseDto> {
    return OrderItemResponseDto.from(await this.getEntity(id));
  }

  async findByOrderId(orderId: string): Promise<OrderItemResponseDto[]> {
    const data = await this.repo.find({
      where: { orderId },
      relations: ['product'],
    });
    return data.map(OrderItemResponseDto.from);
  }

  async create(dto: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    const result = await this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: dto.productId },
        relations: ['detail'],
      });
      if (!product)
        throw new NotFoundException(`Product #${dto.productId} not found`);
      if (!product.detail || product.detail.stock < dto.quantity)
        throw new BadRequestException(
          `Insufficient stock for product #${dto.productId}`,
        );

      product.detail.stock -= dto.quantity;
      await manager.save(product.detail);

      return manager.save(manager.create(OrderItem, dto));
    });
    return OrderItemResponseDto.from(result);
  }

  async createList(
    dtos: CreateOrderItemDto[],
  ): Promise<OrderItemResponseDto[]> {
    const results = await this.dataSource.transaction(async (manager) => {
      const items: OrderItem[] = [];

      for (const dto of dtos) {
        const product = await manager.findOne(Product, {
          where: { id: dto.productId },
          relations: ['detail'],
        });
        if (!product)
          throw new NotFoundException(`Product #${dto.productId} not found`);
        if (!product.detail || product.detail.stock < dto.quantity)
          throw new BadRequestException(
            `Insufficient stock for product #${dto.productId}`,
          );

        product.detail.stock -= dto.quantity;
        await manager.save(product.detail);
        items.push(await manager.save(manager.create(OrderItem, dto)));
      }

      return items;
    });
    return results.map(OrderItemResponseDto.from);
  }

  async update(
    id: string,
    dto: UpdateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    const entity = await this.getEntity(id);
    const result = await this.repo.save({ ...entity, ...dto });
    return OrderItemResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntity(id);
    await this.repo.remove(entity);
  }
}
