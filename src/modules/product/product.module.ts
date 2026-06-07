import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PRODUCT_SERVICE } from './interfaces/product-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [{ provide: PRODUCT_SERVICE, useClass: ProductService }],
  exports: [PRODUCT_SERVICE],
})
export class ProductModule {}
