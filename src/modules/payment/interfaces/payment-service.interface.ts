import { Payment } from '../../../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');

export interface IPaymentService {
  findAll(): Promise<Payment[]>;
  findById(id: string): Promise<Payment>;
  findByOrderId(orderId: string): Promise<Payment>;
  create(dto: CreatePaymentDto): Promise<Payment>;
  update(id: string, dto: UpdatePaymentDto): Promise<Payment>;
  remove(id: string): Promise<void>;
}
