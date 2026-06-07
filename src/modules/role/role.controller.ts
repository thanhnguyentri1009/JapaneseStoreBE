import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
