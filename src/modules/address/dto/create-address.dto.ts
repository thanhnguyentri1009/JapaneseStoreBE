import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAddressDto {
  @IsUUID()
  customerId: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
