import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { STATISTIC_SERVICE } from './interfaces/statistic-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [StatisticController],
  providers: [{ provide: STATISTIC_SERVICE, useClass: StatisticService }],
  exports: [STATISTIC_SERVICE],
})
export class StatisticModule {}
