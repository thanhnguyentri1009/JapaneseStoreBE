import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
