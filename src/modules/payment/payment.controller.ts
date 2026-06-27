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
  PAYMENT_SERVICE,
  IPaymentService,
} from './interfaces/payment-service.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly service: IPaymentService,
  ) {}

  @Get()
  findAll(@Query() { page, perPage }: PaginationDto) {
    return this.service.findAll(page, perPage);
  }

  @Get('order/:orderId')
  findByOrderId(@Param('orderId') orderId: string) {
    return this.service.findByOrderId(orderId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
