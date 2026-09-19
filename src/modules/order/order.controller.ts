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
  ORDER_SERVICE,
  IOrderService,
} from './interfaces/order-service.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly service: IOrderService,
  ) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findAll(@Req() req: any, @Query() { page, perPage }: PaginationDto) {
    if (req.user.role === 'admin') return this.service.findAll(page, perPage);
    return this.service.findAllForAccount(req.user.sub, page, perPage);
  }

  @Get('customer/:customerId')
  findByCustomerId(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Req() req: any,
    @Param('customerId') customerId: string,
  ) {
    if (req.user.role === 'admin')
      return this.service.findByCustomerId(customerId);
    return this.service.findByCustomerIdForAccount(customerId, req.user.sub);
  }

  @Get(':id')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findById(@Req() req: any, @Param('id') id: string) {
    if (req.user.role === 'admin') return this.service.findById(id);
    return this.service.findByIdForAccount(id, req.user.sub);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
