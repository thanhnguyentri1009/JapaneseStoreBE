import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
