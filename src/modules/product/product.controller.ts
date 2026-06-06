import { Controller, Get, Post, Patch, Delete, Param, Body, Inject, ParseIntPipe } from '@nestjs/common';
import { PRODUCT_SERVICE, IProductService } from './interfaces/product-service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly service: IProductService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.service.findByCategoryId(categoryId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
