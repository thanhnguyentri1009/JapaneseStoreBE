import { Order } from '../../../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

export const ORDER_SERVICE = Symbol('ORDER_SERVICE');

export interface IOrderService {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  create(dto: CreateOrderDto): Promise<Order>;
  update(id: string, dto: UpdateOrderDto): Promise<Order>;
  remove(id: string): Promise<void>;
}
