import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const ORDER_ITEM_SERVICE = Symbol('ORDER_ITEM_SERVICE');

export interface IOrderItemService {
  findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<OrderItemResponseDto>>;
  findById(id: string): Promise<OrderItemResponseDto>;
  findByOrderId(orderId: string): Promise<OrderItemResponseDto[]>;
  create(dto: CreateOrderItemDto): Promise<OrderItemResponseDto>;
  createList(dtos: CreateOrderItemDto[]): Promise<OrderItemResponseDto[]>;
  update(id: string, dto: UpdateOrderItemDto): Promise<OrderItemResponseDto>;
  remove(id: string): Promise<void>;
}
