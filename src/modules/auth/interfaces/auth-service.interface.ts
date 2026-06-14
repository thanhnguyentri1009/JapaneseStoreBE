import { SafeAccount } from '../../account/interfaces/account-service.interface';
import { CreateAccountDto } from '../../account/dto/create-account.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface IAuthService {
  register(dto: CreateAccountDto): Promise<SafeAccount>;
  login(dto: LoginDto): Promise<TokenPair>;
  refresh(dto: RefreshTokenDto): Promise<TokenPair>;
}
