import { Account } from '../../../entities/account.entity';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';

export const ACCOUNT_SERVICE = 'ACCOUNT_SERVICE';

export type SafeAccount = Omit<Account, 'password' | 'refresh_token'>;

export interface IAccountService {
  findAll(): Promise<SafeAccount[]>;
  findById(id: string): Promise<SafeAccount>;
  create(dto: CreateAccountDto): Promise<SafeAccount>;
  update(id: string, dto: UpdateAccountDto): Promise<SafeAccount>;
  remove(id: string): Promise<void>;
}
