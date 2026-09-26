import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { TopSellingProductsQueryDto } from './dto/top-selling-products-query.dto';
import {
  IStatisticService,
  STATISTIC_SERVICE,
} from './interfaces/statistic-service.interface';

@ApiBearerAuth()
@Controller('statistics')
export class StatisticController {
  constructor(
    @Inject(STATISTIC_SERVICE)
    private readonly service: IStatisticService,
  ) {}

  @Roles('admin')
  @Get('top-selling-products')
  getTopSellingProducts(
    @Query() { month, year, limit }: TopSellingProductsQueryDto,
  ) {
    return this.service.getTopSellingProducts(month, year, limit);
  }
}
