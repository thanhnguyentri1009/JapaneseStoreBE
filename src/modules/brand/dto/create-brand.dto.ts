import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string;
}
