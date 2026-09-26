import { Controller, Get, Inject } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  DASHBOARD_SERVICE,
  IDashboardService,
} from './interfaces/dashboard-service.interface';

@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(DASHBOARD_SERVICE)
    private readonly service: IDashboardService,
  ) {}

  @Roles('admin')
  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }
}
