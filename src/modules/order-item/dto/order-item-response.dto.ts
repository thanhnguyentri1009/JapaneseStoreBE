import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;
}

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  orderId: string;

  @ApiPropertyOptional()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiPropertyOptional({ type: OrderItemProductDto })
  product: OrderItemProductDto;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): OrderItemResponseDto {
    const dto = new OrderItemResponseDto();
    dto.id = entity.id;
    dto.orderId = entity.orderId;
    dto.productId = entity.productId;
    dto.quantity = entity.quantity;
    dto.unitPrice = entity.unitPrice;
    dto.product = entity.product
      ? {
          id: entity.product.id,
          name: entity.product.name,
          price: entity.product.price,
        }
      : null;
    return dto;
  }
}
