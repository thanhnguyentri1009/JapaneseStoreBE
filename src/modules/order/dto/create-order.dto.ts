import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '../../../entities/order.entity';

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsUUID()
  addressId?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
