import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../entities/customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CUSTOMER_SERVICE } from './interfaces/customer-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [{ provide: CUSTOMER_SERVICE, useClass: CustomerService }],
  exports: [CUSTOMER_SERVICE],
})
export class CustomerModule {}
