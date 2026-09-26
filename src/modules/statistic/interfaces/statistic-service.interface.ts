import { TopSellingProductResponseDto } from '../dto/top-selling-product-response.dto';

export const STATISTIC_SERVICE = Symbol('STATISTIC_SERVICE');

export interface IStatisticService {
  getTopSellingProducts(
    month?: number,
    year?: number,
    limit?: number,
  ): Promise<TopSellingProductResponseDto[]>;
}
