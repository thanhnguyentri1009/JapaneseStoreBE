import { CheckoutDto } from '../dto/checkout.dto';
import { OrderResponseDto } from '../../order/dto/order-response.dto';

export const CHECKOUT_SERVICE = Symbol('CHECKOUT_SERVICE');

export interface ICheckoutService {
  checkout(accountId: string, dto: CheckoutDto): Promise<OrderResponseDto>;
}
