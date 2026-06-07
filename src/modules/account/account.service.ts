import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Account } from '../../entities/account.entity';
import { RoleService } from '../role/role.service';
import {
  IAccountService,
  SafeAccount,
  TokenPair,
} from './interfaces/account-service.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AccountService implements IAccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private omit(account: Account): SafeAccount {
    const { password, refresh_token, ...rest } = account;
    return rest;
  }

  private generateTokens(account: Account): TokenPair {
    const payload = {
      sub: account.id,
      username: account.username,
      role: account.role?.name,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: '3d',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '15d',
    });

    return { access_token, refresh_token };
  }

  async findAll(): Promise<SafeAccount[]> {
    const data = await this.repo.find();
    return data.map((a) => this.omit(a));
  }

  async findById(id: number): Promise<SafeAccount> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);
    return this.omit(entity);
  }

  async create(dto: CreateAccountDto): Promise<SafeAccount> {
    const existing = await this.repo.findOne({
      where: { username: dto.username },
    });
    if (existing)
      throw new ConflictException(`Username "${dto.username}" already taken`);

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const defaultRole = await this.roleService.findByName('user');
    const entity = this.repo.create({
      ...dto,
      password: hashed,
      role: defaultRole,
    });
    const saved = await this.repo.save(entity);
    return this.omit(saved);
  }

  async update(id: number, dto: UpdateAccountDto): Promise<SafeAccount> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const saved = await this.repo.save({ ...entity, ...dto });
    return this.omit(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);
    await this.repo.remove(entity);
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

  async refresh(dto: RefreshTokenDto): Promise<TokenPair> {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refresh_token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const entity = await this.repo.findOne({ where: { id: payload.sub } });
    if (!entity || entity.refresh_token !== dto.refresh_token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(entity);
    await this.repo.save({ ...entity, refresh_token: tokens.refresh_token });

    return tokens;
  }

  async changeRole(
    accountId: number,
    dto: ChangeRoleDto,
  ): Promise<SafeAccount> {
    const entity = await this.repo.findOne({ where: { id: accountId } });
    if (!entity) throw new NotFoundException(`Account #${accountId} not found`);

    const role = await this.roleService.findById(dto.roleId);
    const saved = await this.repo.save({ ...entity, role });
    return this.omit(saved);
  }
}
