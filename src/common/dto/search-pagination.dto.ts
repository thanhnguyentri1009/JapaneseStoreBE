import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class SearchPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Free-text search by name' })
  @IsOptional()
  @IsString()
  searchText?: string;
}
