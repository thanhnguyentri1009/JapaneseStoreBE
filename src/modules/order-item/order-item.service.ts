import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Customer } from '../../entities/customer.entity';
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
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
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
    return { items: data.map(OrderItemResponseDto.from), page, perPage, total };
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
  ): Promise<PaginatedResult<OrderItemResponseDto>> {
    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId) return { items: [], page, perPage, total: 0 };

    const [data, total] = await this.repo.findAndCount({
      where: { order: { customerId } },
      relations: ['product', 'order'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { items: data.map(OrderItemResponseDto.from), page, perPage, total };
  }

  async findByIdForAccount(
    id: string,
    accountId: string,
  ): Promise<OrderItemResponseDto> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['product', 'order'],
    });
    if (!entity) throw new NotFoundException(`OrderItem #${id} not found`);

    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId || entity.order?.customerId !== customerId) {
      throw new ForbiddenException(
        'You do not have access to this order item',
      );
    }
    return OrderItemResponseDto.from(entity);
  }

  async findByOrderIdForAccount(
    orderId: string,
    accountId: string,
  ): Promise<OrderItemResponseDto[]> {
    const customerId = await this.resolveOwnCustomerId(accountId);
    if (!customerId) return [];

    const data = await this.repo.find({
      where: { orderId, order: { customerId } },
      relations: ['product', 'order'],
    });
    return data.map(OrderItemResponseDto.from);
  }

  async create(dto: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    const result = await this.dataSource.transaction(async (manager) => {
      const item = await this.createItem(manager, dto);
      await this.recalculateOrderTotal(manager, dto.orderId);
      return item;
    });
    return OrderItemResponseDto.from(result);
  }

  async createList(
    dtos: CreateOrderItemDto[],
  ): Promise<OrderItemResponseDto[]> {
    const results = await this.dataSource.transaction(async (manager) => {
      const items: OrderItem[] = [];
      for (const dto of dtos) {
        items.push(await this.createItem(manager, dto));
      }
      const orderIds = [...new Set(dtos.map((dto) => dto.orderId))];
      for (const orderId of orderIds) {
        await this.recalculateOrderTotal(manager, orderId);
      }
      return items;
    });
    return results.map(OrderItemResponseDto.from);
  }

  private async createItem(
    manager: EntityManager,
    dto: CreateOrderItemDto,
  ): Promise<OrderItem> {
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

    // unitPrice is snapshotted server-side from the product's current price —
    // never trust a client-supplied price for money-relevant fields.
    return manager.save(
      manager.create(OrderItem, {
        orderId: dto.orderId,
        productId: dto.productId,
        quantity: dto.quantity,
        unitPrice: product.price,
      }),
    );
  }

  async update(
    id: string,
    dto: UpdateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    const result = await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(OrderItem, {
        where: { id },
        relations: ['product', 'product.detail'],
      });
      if (!entity) throw new NotFoundException(`OrderItem #${id} not found`);

      const oldOrderId = entity.orderId;
      const newProductId = dto.productId ?? entity.productId;
      const newQuantity = dto.quantity ?? entity.quantity;

      if (newProductId !== entity.productId) {
        if (entity.product?.detail) {
          entity.product.detail.stock += entity.quantity;
          await manager.save(entity.product.detail);
        }

        const newProduct = await manager.findOne(Product, {
          where: { id: newProductId },
          relations: ['detail'],
        });
        if (!newProduct)
          throw new NotFoundException(`Product #${newProductId} not found`);
        if (!newProduct.detail || newProduct.detail.stock < newQuantity)
          throw new BadRequestException(
            `Insufficient stock for product #${newProductId}`,
          );

        newProduct.detail.stock -= newQuantity;
        await manager.save(newProduct.detail);
        entity.unitPrice = newProduct.price;
      } else if (newQuantity !== entity.quantity) {
        const delta = newQuantity - entity.quantity;
        if (
          delta > 0 &&
          (!entity.product?.detail || entity.product.detail.stock < delta)
        )
          throw new BadRequestException(
            `Insufficient stock for product #${entity.productId}`,
          );

        if (entity.product?.detail) {
          entity.product.detail.stock -= delta;
          await manager.save(entity.product.detail);
        }
      }

      entity.productId = newProductId;
      entity.quantity = newQuantity;
      if (dto.orderId) entity.orderId = dto.orderId;

      const saved = await manager.save(entity);
      await this.recalculateOrderTotal(manager, oldOrderId);
      if (entity.orderId !== oldOrderId) {
        await this.recalculateOrderTotal(manager, entity.orderId);
      }
      return saved;
    });
    return OrderItemResponseDto.from(result);
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(OrderItem, {
        where: { id },
        relations: ['product', 'product.detail'],
      });
      if (!entity) throw new NotFoundException(`OrderItem #${id} not found`);

      if (entity.product?.detail) {
        entity.product.detail.stock += entity.quantity;
        await manager.save(entity.product.detail);
      }

      const orderId = entity.orderId;
      await manager.remove(entity);
      await this.recalculateOrderTotal(manager, orderId);
    });
  }

  private async recalculateOrderTotal(
    manager: EntityManager,
    orderId?: string,
  ): Promise<void> {
    if (!orderId) return;
    const items = await manager.find(OrderItem, { where: { orderId } });
    const total = items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );
    await manager.update(Order, orderId, { totalAmount: total });
  }
}
