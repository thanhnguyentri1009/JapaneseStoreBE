import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { OrderStatus } from '../../entities/order.entity';
import { IStatisticService } from './interfaces/statistic-service.interface';
import { TopSellingProductResponseDto } from './dto/top-selling-product-response.dto';

@Injectable()
export class StatisticService implements IStatisticService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  async getTopSellingProducts(
    month?: number,
    year?: number,
    limit = 10,
  ): Promise<TopSellingProductResponseDto[]> {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 1);

    const rows = await this.orderItemRepo
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .innerJoin('item.product', 'product')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.image', 'productImage')
      .addSelect('SUM(item.quantity)', 'totalQuantitySold')
      .addSelect('SUM(item.quantity * item.unitPrice)', 'totalRevenue')
      .where('order.status != :cancelled', {
        cancelled: OrderStatus.CANCELLED,
      })
      .andWhere('order.orderedAt >= :startDate', { startDate })
      .andWhere('order.orderedAt < :endDate', { endDate })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('product.image')
      .orderBy('SUM(item.quantity)', 'DESC')
      .limit(limit)
      .getRawMany();

    return rows.map(TopSellingProductResponseDto.from);
  }
}
