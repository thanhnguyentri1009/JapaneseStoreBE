import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../../entities/account.entity';
import { Profile } from '../../entities/profile.entity';
import { RoleService } from '../role/role.service';
import { IAccountService } from './interfaces/account-service.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

const SALT_ROUNDS = 10;

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly roleService: RoleService,
  ) {}

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedResult<AccountResponseDto>> {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { data: data.map(AccountResponseDto.from), page, perPage, total };
  }

  async findById(id: string): Promise<AccountResponseDto> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);
    return AccountResponseDto.from(entity);
  }

  async create(dto: CreateAccountDto): Promise<AccountResponseDto> {
    const existing = await this.repo.findOne({
      where: { username: dto.username },
    });
    if (existing)
      throw new ConflictException(`Username "${dto.username}" already taken`);

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const role = dto.roleId
      ? await this.roleService.findById(dto.roleId)
      : await this.roleService.findByName('user');
    const { roleId: _, ...rest } = dto;
    const entity = this.repo.create({
      ...rest,
      password: hashed,
      role,
    });
    const saved = await this.repo.save(entity);
    return AccountResponseDto.from(saved);
  }

  async update(id: string, dto: UpdateAccountDto): Promise<AccountResponseDto> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const saved = await this.repo.save({ ...entity, ...dto });
    return AccountResponseDto.from(saved);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Account #${id} not found`);

    const profile = await this.profileRepo.findOne({
      where: { accountId: id },
    });
    if (profile) await this.profileRepo.remove(profile);

    await this.repo.remove(entity);
  }
}
