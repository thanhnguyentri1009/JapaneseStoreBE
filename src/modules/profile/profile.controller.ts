import { Controller, Get, Patch, Body, Inject, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  PROFILE_SERVICE,
  IProfileService,
} from './interfaces/profile-service.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(
    @Inject(PROFILE_SERVICE) private readonly service: IProfileService,
  ) {}

  @Get('me')
  getProfile(@Req() req: any) {
    return this.service.findByAccountId(req.user.sub);
  }

  @Patch('me')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.service.updateByAccountId(req.user.sub, dto);
  }
}
