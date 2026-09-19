import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '../../../entities/order.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
