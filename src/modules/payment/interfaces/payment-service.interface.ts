import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');

export interface IPaymentService {
  findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<PaymentResponseDto>>;
  findById(id: string): Promise<PaymentResponseDto>;
  findByOrderId(orderId: string): Promise<PaymentResponseDto>;
  create(dto: CreatePaymentDto): Promise<PaymentResponseDto>;
  update(id: string, dto: UpdatePaymentDto): Promise<PaymentResponseDto>;
  remove(id: string): Promise<void>;

  // Scoped variants used when the caller isn't an admin — restrict results
  // to payments whose order belongs to the customer linked to their own account.
  findAllForAccount(
    accountId: string,
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<PaymentResponseDto>>;
  findByIdForAccount(
    id: string,
    accountId: string,
  ): Promise<PaymentResponseDto>;
  findByOrderIdForAccount(
    orderId: string,
    accountId: string,
  ): Promise<PaymentResponseDto>;
}
