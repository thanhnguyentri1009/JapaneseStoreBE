import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../../entities/address.entity';
import { Customer } from '../../entities/customer.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { ADDRESS_SERVICE } from './interfaces/address-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Customer])],
  controllers: [AddressController],
  providers: [{ provide: ADDRESS_SERVICE, useClass: AddressService }],
  exports: [ADDRESS_SERVICE],
})
export class AddressModule {}
