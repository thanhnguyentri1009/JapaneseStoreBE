import { OrderItem } from '../../../entities/order-item.entity';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

export const ORDER_ITEM_SERVICE = Symbol('ORDER_ITEM_SERVICE');

export interface IOrderItemService {
  findAll(): Promise<OrderItem[]>;
  findById(id: number): Promise<OrderItem>;
  findByOrderId(orderId: number): Promise<OrderItem[]>;
  create(dto: CreateOrderItemDto): Promise<OrderItem>;
  update(id: number, dto: UpdateOrderItemDto): Promise<OrderItem>;
  remove(id: number): Promise<void>;
}
