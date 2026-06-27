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
  ADDRESS_SERVICE,
  IAddressService,
} from './interfaces/address-service.interface';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiBearerAuth()
@Controller('addresses')
export class AddressController {
  constructor(
    @Inject(ADDRESS_SERVICE)
    private readonly service: IAddressService,
  ) {}

  @Get()
  findAll(@Query() { page, perPage }: PaginationDto) {
    return this.service.findAll(page, perPage);
  }

  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId') customerId: string) {
    return this.service.findByCustomerId(customerId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateAddressDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
