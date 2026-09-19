import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  img: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): ProfileResponseDto {
    const dto = new ProfileResponseDto();
    dto.id = entity.id;
    dto.accountId = entity.accountId;
    dto.fullName = entity.fullName;
    dto.username = entity.username;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.address = entity.address;
    dto.img = entity.img;
    return dto;
  }
}
