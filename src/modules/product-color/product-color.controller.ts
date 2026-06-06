import { Controller, Get, Post, Patch, Delete, Param, Body, Inject, ParseIntPipe } from '@nestjs/common';
import { PRODUCT_COLOR_SERVICE, IProductColorService } from './interfaces/product-color-service.interface';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';

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
  findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.service.findByProductId(productId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateProductColorDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductColorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
