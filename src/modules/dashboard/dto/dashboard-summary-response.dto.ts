import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryResponseDto {
  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalProduct: number;

  @ApiProperty()
  totalUser: number;

  static from(data: {
    totalRevenue: number;
    totalOrders: number;
    totalProduct: number;
    totalUser: number;
  }): DashboardSummaryResponseDto {
    const dto = new DashboardSummaryResponseDto();
    dto.totalRevenue = data.totalRevenue;
    dto.totalOrders = data.totalOrders;
    dto.totalProduct = data.totalProduct;
    dto.totalUser = data.totalUser;
    return dto;
  }
}
