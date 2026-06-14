import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsString()
  nibType?: string;

  @IsOptional()
  @IsString()
  inkType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  colorCount?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
