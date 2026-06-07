import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Account } from '../../entities/account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ACCOUNT_SERVICE } from './interfaces/account-service.interface';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({}),
    RoleModule,
  ],
  controllers: [AccountController],
  providers: [{ provide: ACCOUNT_SERVICE, useClass: AccountService }],
  exports: [ACCOUNT_SERVICE],
})
export class AccountModule {}
