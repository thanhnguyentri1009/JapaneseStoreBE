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
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  PRODUCT_SERVICE,
  IProductService,
} from './interfaces/product-service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly service: IProductService,
  ) {}

  @Public()
  @Get()
  findAll(@Query() { page, perPage, searchText, size }: ProductQueryDto) {
    return this.service.findAll(page, perPage, searchText, size);
  }

  @Public()
  @Get('category/:categoryId')
  findByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query() { searchText, size }: ProductQueryDto,
  ) {
    return this.service.findByCategoryId(categoryId, searchText, size);
  }

  @Public()
  @Get('brand/:brandId')
  findByBrandId(
    @Param('brandId') brandId: string,
    @Query() { searchText, size }: ProductQueryDto,
  ) {
    return this.service.findByBrandId(brandId, searchText, size);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
