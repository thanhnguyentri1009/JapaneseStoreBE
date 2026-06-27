import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemSummaryDto {
  @ApiProperty() id: string;
  @ApiPropertyOptional() productId: string;
  @ApiProperty() quantity: number;
  @ApiProperty() unitPrice: number;
  @ApiPropertyOptional() product: { id: string; name: string; price: number };
}

class OrderPaymentSummaryDto {
  @ApiProperty() id: string;
  @ApiPropertyOptional() method: string;
  @ApiPropertyOptional() status: string;
  @ApiPropertyOptional() amount: number;
  @ApiPropertyOptional() paidAt: Date;
}

class OrderAddressSummaryDto {
  @ApiProperty() id: string;
  @ApiProperty() address: string;
  @ApiPropertyOptional() city: string;
  @ApiProperty() country: string;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  customerId: string;

  @ApiPropertyOptional()
  addressId: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  totalAmount: number;

  @ApiProperty()
  orderedAt: Date;

  @ApiProperty({ type: [OrderItemSummaryDto] })
  items: OrderItemSummaryDto[];

  @ApiPropertyOptional({ type: OrderPaymentSummaryDto })
  payment: OrderPaymentSummaryDto;

  @ApiPropertyOptional({ type: OrderAddressSummaryDto })
  address: OrderAddressSummaryDto;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = entity.id;
    dto.customerId = entity.customerId;
    dto.addressId = entity.addressId;
    dto.status = entity.status;
    dto.totalAmount = entity.totalAmount;
    dto.orderedAt = entity.orderedAt;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dto.items = (entity.items || []).map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
          }
        : null,
    }));
    dto.payment = entity.payment
      ? {
          id: entity.payment.id,
          method: entity.payment.method,
          status: entity.payment.status,
          amount: entity.payment.amount,
          paidAt: entity.payment.paidAt,
        }
      : null;
    dto.address = entity.address
      ? {
          id: entity.address.id,
          address: entity.address.address,
          city: entity.address.city,
          country: entity.address.country,
        }
      : null;
    return dto;
  }
}
