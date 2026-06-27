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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  PRODUCT_SERVICE,
  IProductService,
} from './interfaces/product-service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { multerImageOptions } from '../../common/utils/file-upload.util';

@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly service: IProductService,
  ) {}

  @Get()
  findAll(@Query() { page, perPage }: PaginationDto) {
    return this.service.findAll(page, perPage);
  }

  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.service.findByCategoryId(categoryId);
  }

  @Get('brand/:brandId')
  findByBrandId(@Param('brandId') brandId: string) {
    return this.service.findByBrandId(brandId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image', 'name', 'price'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image (jpg/png/gif/webp, max 5MB)',
        },
        name: { type: 'string' },
        categoryId: { type: 'string', format: 'uuid' },
        brandId: { type: 'string', format: 'uuid' },
        series: { type: 'string' },
        nibType: { type: 'string' },
        inkType: { type: 'string' },
        colorCount: { type: 'integer' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        isActive: { type: 'boolean' },
      },
    },
  })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    if (!file) throw new BadRequestException('Image is required');
    return this.service.create(dto, file.filename);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image (jpg/png/gif/webp, max 5MB)',
        },
        name: { type: 'string' },
        categoryId: { type: 'string', format: 'uuid' },
        brandId: { type: 'string', format: 'uuid' },
        series: { type: 'string' },
        nibType: { type: 'string' },
        inkType: { type: 'string' },
        colorCount: { type: 'integer' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        isActive: { type: 'boolean' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(id, dto, file?.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
