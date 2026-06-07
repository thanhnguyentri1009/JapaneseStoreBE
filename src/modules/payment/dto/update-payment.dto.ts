import { IsDateString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../../../entities/payment.entity';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsDateString()
  paidAt?: Date;
}
