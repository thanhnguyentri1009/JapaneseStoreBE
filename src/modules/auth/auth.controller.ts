import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import {
  AUTH_SERVICE,
  IAuthService,
} from './interfaces/auth-service.interface';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateAccountDto } from '../account/dto/create-account.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly service: IAuthService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: CreateAccountDto) {
    return this.service.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.service.refresh(dto);
  }
}
