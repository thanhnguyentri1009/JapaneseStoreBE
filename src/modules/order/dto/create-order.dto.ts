import { OrderStatus } from '../../../entities/order.entity';

export class CreateOrderDto {
  customerId: number;
  addressId?: number;
  status?: OrderStatus;
  totalAmount?: number;
}
