import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductColorDto {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsString()
  colorCode?: string;

  @IsOptional()
  @IsString()
  colorName?: string;

  @IsOptional()
  @IsString()
  hexValue?: string;
}
