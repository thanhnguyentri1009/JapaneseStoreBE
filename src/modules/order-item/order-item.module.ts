import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { ORDER_ITEM_SERVICE } from './interfaces/order-item-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Product])],
  controllers: [OrderItemController],
  providers: [{ provide: ORDER_ITEM_SERVICE, useClass: OrderItemService }],
  exports: [ORDER_ITEM_SERVICE],
})
export class OrderItemModule {}
