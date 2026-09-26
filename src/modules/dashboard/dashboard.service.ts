import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Account } from '../../entities/account.entity';
import { IDashboardService } from './interfaces/dashboard-service.interface';
import { DashboardSummaryResponseDto } from './dto/dashboard-summary-response.dto';

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async getSummary(): Promise<DashboardSummaryResponseDto> {
    const [{ sum }, totalOrders, totalProduct, totalUser] = await Promise.all([
      this.orderRepo
        .createQueryBuilder('order')
        .select('COALESCE(SUM(order.totalAmount), 0)', 'sum')
        .where('order.status != :cancelled', {
          cancelled: OrderStatus.CANCELLED,
        })
        .getRawOne<{ sum: string }>(),
      this.orderRepo.count(),
      this.productRepo.count(),
      this.accountRepo.count(),
    ]);

    return DashboardSummaryResponseDto.from({
      totalRevenue: Number(sum),
      totalOrders,
      totalProduct,
      totalUser,
    });
  }
}
