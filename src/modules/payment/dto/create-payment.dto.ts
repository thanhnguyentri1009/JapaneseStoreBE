export class CreatePaymentDto {
  orderId: number;
  method?: string;
  status?: string;
  amount?: number;
  paidAt?: Date;
}
