import { Controller, Get, Param, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  findAll(@Query() { page, perPage }: PaginationDto) {
    return this.service.findAll(page, perPage);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
