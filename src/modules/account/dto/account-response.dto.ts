import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AccountRoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class AccountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional({ type: AccountRoleDto })
  role: AccountRoleDto;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): AccountResponseDto {
    const dto = new AccountResponseDto();
    dto.id = entity.id;
    dto.username = entity.username;
    dto.email = entity.email;
    dto.role = entity.role
      ? { id: entity.role.id, name: entity.role.name }
      : null;
    return dto;
  }
}
