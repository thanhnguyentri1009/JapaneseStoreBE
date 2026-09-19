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

  // Scoped variants used when the caller isn't an admin — restrict results
  // to items whose order belongs to the customer linked to their own account.
  findAllForAccount(
    accountId: string,
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<OrderItemResponseDto>>;
  findByIdForAccount(
    id: string,
    accountId: string,
  ): Promise<OrderItemResponseDto>;
  findByOrderIdForAccount(
    orderId: string,
    accountId: string,
  ): Promise<OrderItemResponseDto[]>;
}
