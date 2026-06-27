import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  customerId: string;

  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  isDefault: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): AddressResponseDto {
    const dto = new AddressResponseDto();
    dto.id = entity.id;
    dto.customerId = entity.customerId;
    dto.address = entity.address;
    dto.city = entity.city;
    dto.country = entity.country;
    dto.isDefault = entity.isDefault;
    return dto;
  }
}
