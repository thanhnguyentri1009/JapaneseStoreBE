import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  orderId: string;

  @ApiPropertyOptional()
  method: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  amount: number;

  @ApiPropertyOptional()
  paidAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = entity.id;
    dto.orderId = entity.orderId;
    dto.method = entity.method;
    dto.status = entity.status;
    dto.amount = entity.amount;
    dto.paidAt = entity.paidAt;
    return dto;
  }
}
