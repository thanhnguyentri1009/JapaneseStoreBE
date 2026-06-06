import { Payment } from '../../../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');

export interface IPaymentService {
  findAll(): Promise<Payment[]>;
  findById(id: number): Promise<Payment>;
  findByOrderId(orderId: number): Promise<Payment>;
  create(dto: CreatePaymentDto): Promise<Payment>;
  update(id: number, dto: UpdatePaymentDto): Promise<Payment>;
  remove(id: number): Promise<void>;
}
