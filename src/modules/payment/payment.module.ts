import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PAYMENT_SERVICE } from './interfaces/payment-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [{ provide: PAYMENT_SERVICE, useClass: PaymentService }],
  exports: [PAYMENT_SERVICE],
})
export class PaymentModule {}
