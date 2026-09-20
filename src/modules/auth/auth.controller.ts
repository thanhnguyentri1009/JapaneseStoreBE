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
import { ConfigService } from '@nestjs/config';
import { Public } from '../../common/decorators/public.decorator';
import {
  AUTH_SERVICE,
  IAuthService,
} from './interfaces/auth-service.interface';
import { LoginDto } from './dto/login.dto';
import { CreateAccountDto } from '../account/dto/create-account.dto';

const REFRESH_COOKIE = 'refresh_token';

// FE và BE deploy khác domain (Vercel/Netlify <-> Render) → cookie phải
// SameSite=None; Secure để trình duyệt còn gửi kèm cross-site. Dev local
// (http, cùng-site) thì vẫn dùng Lax vì Secure cookie không set được qua http.
function buildCookieOptions(isProd: boolean) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    path: '/',
  };
}

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  private readonly cookieOptions: ReturnType<typeof buildCookieOptions>;

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly service: IAuthService,
    config: ConfigService,
  ) {
    this.cookieOptions = buildCookieOptions(
      config.get('NODE_ENV') === 'production',
    );
  }

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
    res.cookie(REFRESH_COOKIE, refresh_token, this.cookieOptions);
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
    res.cookie(REFRESH_COOKIE, refresh_token, this.cookieOptions);
    return { access_token };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (refreshToken) await this.service.logout(refreshToken);
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return { message: 'Logged out' };
  }
}
