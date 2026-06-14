import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../../entities/brand.entity';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BRAND_SERVICE } from './interfaces/brand-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandController],
  providers: [{ provide: BRAND_SERVICE, useClass: BrandService }],
  exports: [BRAND_SERVICE],
})
export class BrandModule {}
