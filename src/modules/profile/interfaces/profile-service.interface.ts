import { Profile } from '../../../entities/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export const PROFILE_SERVICE = Symbol('PROFILE_SERVICE');

export interface IProfileService {
  findByAccountId(accountId: string): Promise<Profile>;
  updateByAccountId(accountId: string, dto: UpdateProfileDto): Promise<Profile>;
}
