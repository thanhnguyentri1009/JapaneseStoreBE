import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiProperty()
  createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
