import {
  Controller,
  Post,
  Body,
  Inject,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import {
  AUTH_SERVICE,
  IAuthService,
} from './interfaces/auth-service.interface';
import { LoginDto } from './dto/login.dto';
import { CreateAccountDto } from '../account/dto/create-account.dto';

const REFRESH_COOKIE = 'refresh_token';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  path: '/',
};

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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.service.login(dto);
    res.cookie(REFRESH_COOKIE, refresh_token, cookieOptions);
    return { access_token };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    const { access_token, refresh_token } =
      await this.service.refresh(refreshToken);
    res.cookie(REFRESH_COOKIE, refresh_token, cookieOptions);
    return { access_token };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return { message: 'Logged out' };
  }
}
