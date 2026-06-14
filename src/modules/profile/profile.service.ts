import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';
import { IProfileService } from './interfaces/profile-service.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  async findByAccountId(accountId: string): Promise<Profile> {
    const entity = await this.repo.findOne({ where: { accountId } });
    if (!entity) throw new NotFoundException('Profile not found');
    return entity;
  }

  async updateByAccountId(
    accountId: string,
    dto: UpdateProfileDto,
  ): Promise<Profile> {
    const entity = await this.findByAccountId(accountId);
    return this.repo.save({ ...entity, ...dto });
  }
}
