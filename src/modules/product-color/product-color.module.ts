import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductColor } from '../../entities/product-color.entity';
import { ProductColorService } from './product-color.service';
import { ProductColorController } from './product-color.controller';
import { PRODUCT_COLOR_SERVICE } from './interfaces/product-color-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ProductColor])],
  controllers: [ProductColorController],
  providers: [{ provide: PRODUCT_COLOR_SERVICE, useClass: ProductColorService }],
  exports: [PRODUCT_COLOR_SERVICE],
})
export class ProductColorModule {}
