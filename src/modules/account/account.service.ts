import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../../entities/account.entity';
import { RoleService } from '../role/role.service';
import {
  IAccountService,
  SafeAccount,
} from './interfaces/account-service.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
    private readonly roleService: RoleService,
  ) {}

  private omit(account: Account): SafeAccount {
    const { password, refresh_token, ...rest } = account;
    return rest;
  }

  async findAll(): Promise<SafeAccount[]> {
    const data = await this.repo.find();
    return data.map((a) => this.omit(a));
  }

  async findById(id: string): Promise<SafeAccount> {
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

  async update(id: string, dto: UpdateAccountDto): Promise<SafeAccount> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const saved = await this.repo.save({ ...entity, ...dto });
    return this.omit(saved);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);
    await this.repo.remove(entity);
  }
}
