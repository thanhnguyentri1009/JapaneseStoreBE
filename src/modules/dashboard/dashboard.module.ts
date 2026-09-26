import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Account } from '../../entities/account.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DASHBOARD_SERVICE } from './interfaces/dashboard-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Account])],
  controllers: [DashboardController],
  providers: [{ provide: DASHBOARD_SERVICE, useClass: DashboardService }],
  exports: [DASHBOARD_SERVICE],
})
export class DashboardModule {}
