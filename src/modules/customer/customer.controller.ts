import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
  Query,
} from '@nestjs/common';
import {
  CUSTOMER_SERVICE,
  ICustomerService,
} from './interfaces/customer-service.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(
    @Inject(CUSTOMER_SERVICE)
    private readonly service: ICustomerService,
  ) {}

  @Get()
  findAll(@Query() { page, perPage }: PaginationDto) {
    return this.service.findAll(page, perPage);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.service.findByEmail(email);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
