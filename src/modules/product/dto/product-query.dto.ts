import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { SearchPaginationDto } from '../../../common/dto/search-pagination.dto';

export class ProductQueryDto extends SearchPaginationDto {
  @ApiPropertyOptional({
    description:
      'Filter by number of colors in the set (e.g. 70, 150) — same product name can come in different sizes',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : value))
  @IsInt()
  @Min(1)
  size?: number;
}
