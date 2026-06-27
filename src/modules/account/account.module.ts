import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entities/account.entity';
import { Profile } from '../../entities/profile.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ACCOUNT_SERVICE } from './interfaces/account-service.interface';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Profile]), RoleModule],
  controllers: [AccountController],
  providers: [{ provide: ACCOUNT_SERVICE, useClass: AccountService }],
  exports: [ACCOUNT_SERVICE],
})
export class AccountModule {}
