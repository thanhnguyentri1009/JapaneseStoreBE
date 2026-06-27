import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';
import { IProfileService } from './interfaces/profile-service.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  private async getEntity(accountId: string): Promise<Profile> {
    const entity = await this.repo.findOne({ where: { accountId } });
    if (!entity) throw new NotFoundException('Profile not found');
    return entity;
  }

  async findByAccountId(accountId: string): Promise<ProfileResponseDto> {
    return ProfileResponseDto.from(await this.getEntity(accountId));
  }

  async updateByAccountId(
    accountId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const entity = await this.getEntity(accountId);
    const result = await this.repo.save({ ...entity, ...dto });
    return ProfileResponseDto.from(result);
  }
}
