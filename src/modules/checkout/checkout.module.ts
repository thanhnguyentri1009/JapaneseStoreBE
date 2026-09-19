import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { CHECKOUT_SERVICE } from './interfaces/checkout-service.interface';
import { OrderModule } from '../order/order.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [OrderModule, MailModule],
  controllers: [CheckoutController],
  providers: [{ provide: CHECKOUT_SERVICE, useClass: CheckoutService }],
})
export class CheckoutModule {}
