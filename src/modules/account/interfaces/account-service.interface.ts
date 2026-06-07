import { Account } from '../../../entities/account.entity';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';

export const ACCOUNT_SERVICE = 'ACCOUNT_SERVICE';

export type SafeAccount = Omit<Account, 'password' | 'refresh_token'>;

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface IAccountService {
  findAll(): Promise<SafeAccount[]>;
  findById(id: number): Promise<SafeAccount>;
  create(dto: CreateAccountDto): Promise<SafeAccount>;
  update(id: number, dto: UpdateAccountDto): Promise<SafeAccount>;
  remove(id: number): Promise<void>;
  login(dto: LoginDto): Promise<TokenPair>;
  refresh(dto: RefreshTokenDto): Promise<TokenPair>;
  changeRole(accountId: number, dto: ChangeRoleDto): Promise<SafeAccount>;
}
