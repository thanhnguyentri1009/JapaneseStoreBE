import {
  Injectable,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Account } from '../../entities/account.entity';
import { Profile } from '../../entities/profile.entity';
import {
  ACCOUNT_SERVICE,
  IAccountService,
} from '../account/interfaces/account-service.interface';
import { AccountResponseDto } from '../account/dto/account-response.dto';
import { IAuthService, TokenPair } from './interfaces/auth-service.interface';
import { LoginDto } from './dto/login.dto';
import { CreateAccountDto } from '../account/dto/create-account.dto';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../utils';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(ACCOUNT_SERVICE)
    private readonly accountService: IAccountService,
  ) {}

  private generateTokens(account: Account): TokenPair {
    const payload = {
      sub: account.id,
      username: account.username,
      role: account.role?.name,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.get(ACCESS_TOKEN),
      expiresIn: '3d',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get(REFRESH_TOKEN),
      expiresIn: '15d',
    });

    return { access_token, refresh_token };
  }

  async register(dto: CreateAccountDto): Promise<AccountResponseDto> {
    const account = await this.accountService.create(dto);
    await this.profileRepo.save(
      this.profileRepo.create({
        accountId: account.id,
        fullName: dto.username,
      }),
    );
    return account;
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const entity = await this.repo.findOne({
      where: { username: dto.username },
    });
    if (!entity) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, entity.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.generateTokens(entity);
    await this.repo.save({ ...entity, refresh_token: tokens.refresh_token });

    this.logger.log(`Account "${entity.username}" logged in`);
    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get(REFRESH_TOKEN),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const entity = await this.repo.findOne({ where: { id: payload.sub } });
    if (!entity || entity.refresh_token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(entity);
    await this.repo.save({ ...entity, refresh_token: tokens.refresh_token });

    return tokens;
  }
}
