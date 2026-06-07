import { IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
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

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;
}
