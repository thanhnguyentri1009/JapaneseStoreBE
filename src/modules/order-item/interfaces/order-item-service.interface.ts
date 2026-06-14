import { OrderItem } from '../../../entities/order-item.entity';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

export const ORDER_ITEM_SERVICE = Symbol('ORDER_ITEM_SERVICE');

export interface IOrderItemService {
  findAll(): Promise<OrderItem[]>;
  findById(id: string): Promise<OrderItem>;
  findByOrderId(orderId: string): Promise<OrderItem[]>;
  create(dto: CreateOrderItemDto): Promise<OrderItem>;
  createList(dtos: CreateOrderItemDto[]): Promise<OrderItem[]>;
  update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem>;
  remove(id: string): Promise<void>;
}
