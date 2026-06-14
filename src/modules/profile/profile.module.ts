import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PROFILE_SERVICE } from './interfaces/profile-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [{ provide: PROFILE_SERVICE, useClass: ProfileService }],
  exports: [PROFILE_SERVICE],
})
export class ProfileModule {}
