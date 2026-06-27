import { ApiProperty } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from(entity: any): BrandResponseDto {
    const dto = new BrandResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    return dto;
  }
}
