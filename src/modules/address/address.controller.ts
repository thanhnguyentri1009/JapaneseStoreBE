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
  Req,
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
  update(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    if (req.user.role === 'admin') return this.service.update(id, dto);
    return this.service.updateForAccount(id, dto, req.user.sub);
  }

  @Delete(':id')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role === 'admin') return this.service.remove(id);
    return this.service.removeForAccount(id, req.user.sub);
  }
}
