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
  PAYMENT_SERVICE,
  IPaymentService,
} from './interfaces/payment-service.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly service: IPaymentService,
  ) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findAll(@Req() req: any, @Query() { page, perPage }: PaginationDto) {
    if (req.user.role === 'admin') return this.service.findAll(page, perPage);
    return this.service.findAllForAccount(req.user.sub, page, perPage);
  }

  @Get('order/:orderId')
  findByOrderId(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Req() req: any,
    @Param('orderId') orderId: string,
  ) {
    if (req.user.role === 'admin') return this.service.findByOrderId(orderId);
    return this.service.findByOrderIdForAccount(orderId, req.user.sub);
  }

  @Get(':id')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findById(@Req() req: any, @Param('id') id: string) {
    if (req.user.role === 'admin') return this.service.findById(id);
    return this.service.findByIdForAccount(id, req.user.sub);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
