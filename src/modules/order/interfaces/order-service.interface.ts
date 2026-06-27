import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const ORDER_SERVICE = Symbol('ORDER_SERVICE');

export interface IOrderService {
  findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<OrderResponseDto>>;
  findById(id: string): Promise<OrderResponseDto>;
  findByCustomerId(customerId: string): Promise<OrderResponseDto[]>;
  create(dto: CreateOrderDto): Promise<OrderResponseDto>;
  update(id: string, dto: UpdateOrderDto): Promise<OrderResponseDto>;
  remove(id: string): Promise<void>;
}
