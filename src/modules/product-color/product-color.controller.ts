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
  PRODUCT_COLOR_SERVICE,
  IProductColorService,
} from './interfaces/product-color-service.interface';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('product-colors')
export class ProductColorController {
  constructor(
    @Inject(PRODUCT_COLOR_SERVICE)
    private readonly service: IProductColorService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string) {
    return this.service.findByProductId(productId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateProductColorDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductColorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
