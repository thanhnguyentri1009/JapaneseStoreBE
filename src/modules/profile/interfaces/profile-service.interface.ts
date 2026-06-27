import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';

export const PROFILE_SERVICE = Symbol('PROFILE_SERVICE');

export interface IProfileService {
  findByAccountId(accountId: string): Promise<ProfileResponseDto>;
  updateByAccountId(
    accountId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto>;
}
