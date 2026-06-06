import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ORDER_SERVICE } from './interfaces/order-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [{ provide: ORDER_SERVICE, useClass: OrderService }],
  exports: [ORDER_SERVICE],
})
export class OrderModule {}
