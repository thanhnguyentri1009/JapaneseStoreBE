import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopSellingProductResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiPropertyOptional()
  image: string;

  @ApiProperty()
  totalQuantitySold: number;

  @ApiProperty()
  totalRevenue: number;

  static from(raw: {
    productId: string;
    productName: string;
    productImage: string;
    totalQuantitySold: string;
    totalRevenue: string;
  }): TopSellingProductResponseDto {
    const dto = new TopSellingProductResponseDto();
    dto.productId = raw.productId;
    dto.productName = raw.productName;
    dto.image = raw.productImage;
    dto.totalQuantitySold = Number(raw.totalQuantitySold);
    dto.totalRevenue = Number(raw.totalRevenue);
    return dto;
  }
}
