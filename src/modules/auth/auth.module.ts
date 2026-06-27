import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Account } from '../../entities/account.entity';
import { Profile } from '../../entities/profile.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE } from './interfaces/auth-service.interface';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Profile]),
    JwtModule.register({}),
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [{ provide: AUTH_SERVICE, useClass: AuthService }],
})
export class AuthModule {}
