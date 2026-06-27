import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    return dto;
  }
}
