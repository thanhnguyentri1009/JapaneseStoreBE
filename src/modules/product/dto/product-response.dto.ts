import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductCategoryDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

class ProductBrandDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

class ProductDetailDto {
  @ApiPropertyOptional() nibType: string;
  @ApiPropertyOptional() inkType: string;
  @ApiPropertyOptional() colorCount: number;
  @ApiProperty() stock: number;
  @ApiProperty() isActive: boolean;
  @ApiPropertyOptional({ type: [String] }) descriptions: string[];
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  series: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  categoryId: string;

  @ApiPropertyOptional({ type: ProductCategoryDto })
  category: ProductCategoryDto;

  @ApiPropertyOptional()
  brandId: string;

  @ApiPropertyOptional({ type: ProductBrandDto })
  brand: ProductBrandDto;

  @ApiPropertyOptional({ type: ProductDetailDto })
  detail: ProductDetailDto;

  @ApiPropertyOptional()
  image: string;

  @ApiProperty()
  createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.series = entity.series;
    dto.price = entity.price;
    dto.image = entity.image;
    dto.categoryId = entity.categoryId;
    dto.category = entity.category
      ? { id: entity.category.id, name: entity.category.name }
      : null;
    dto.brandId = entity.brandId;
    dto.brand = entity.brand
      ? { id: entity.brand.id, name: entity.brand.name }
      : null;
    dto.detail = entity.detail
      ? {
          nibType: entity.detail.nibType,
          inkType: entity.detail.inkType,
          colorCount: entity.detail.colorCount,
          stock: entity.detail.stock,
          isActive: entity.detail.isActive,
          descriptions: entity.detail.descriptions,
        }
      : null;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
