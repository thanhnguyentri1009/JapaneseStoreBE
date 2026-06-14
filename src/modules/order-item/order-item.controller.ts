import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
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
  findAll() {
    return this.service.findAll();
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
  create(@Body() dto: CreateOrderItemDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  createList(@Body() body: CreateOrderItemListDto) {
    return this.service.createList(body.items);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderItemDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
