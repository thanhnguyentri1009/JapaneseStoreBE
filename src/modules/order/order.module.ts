import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ORDER_SERVICE } from './interfaces/order-service.interface';
import { OrderGateway } from './order.gateway';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer]), MailModule],
  controllers: [OrderController],
  providers: [{ provide: ORDER_SERVICE, useClass: OrderService }, OrderGateway],
  exports: [ORDER_SERVICE, OrderGateway],
})
export class OrderModule {}
