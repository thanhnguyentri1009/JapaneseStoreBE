import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AccountResponseDto } from '../dto/account-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export const ACCOUNT_SERVICE = 'ACCOUNT_SERVICE';

export interface IAccountService {
  findAll(
    page: number,
    perPage: number,
    searchText?: string,
  ): Promise<PaginatedResult<AccountResponseDto>>;
  findById(id: string): Promise<AccountResponseDto>;
  create(dto: CreateAccountDto): Promise<AccountResponseDto>;
  update(id: string, dto: UpdateAccountDto): Promise<AccountResponseDto>;
  remove(id: string): Promise<void>;
}
