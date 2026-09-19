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
  ORDER_ITEM_SERVICE,
  IOrderItemService,
} from './interfaces/order-item-service.interface';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';

class CreateOrderItemListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

@ApiBearerAuth()
@Controller('order-items')
export class OrderItemController {
  constructor(
    @Inject(ORDER_ITEM_SERVICE)
    private readonly service: IOrderItemService,
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
  create(@Body() dto: CreateOrderItemDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Post('bulk')
  createList(@Body() body: CreateOrderItemListDto) {
    return this.service.createList(body.items);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderItemDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
