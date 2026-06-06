import { Order } from '../../../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

export const ORDER_SERVICE = Symbol('ORDER_SERVICE');

export interface IOrderService {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order>;
  findByCustomerId(customerId: number): Promise<Order[]>;
  create(dto: CreateOrderDto): Promise<Order>;
  update(id: number, dto: UpdateOrderDto): Promise<Order>;
  remove(id: number): Promise<void>;
}
