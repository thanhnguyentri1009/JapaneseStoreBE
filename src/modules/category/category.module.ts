import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CATEGORY_SERVICE } from './interfaces/category-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [{ provide: CATEGORY_SERVICE, useClass: CategoryService }],
  exports: [CATEGORY_SERVICE],
})
export class CategoryModule {}
