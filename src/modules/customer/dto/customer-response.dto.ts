import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  accountId: string;

  @ApiPropertyOptional()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiProperty()
  isRegistered: boolean;

  @ApiProperty()
  createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = entity.id;
    dto.accountId = entity.accountId;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.isRegistered = entity.isRegistered;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
