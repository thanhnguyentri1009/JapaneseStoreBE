import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ACCOUNT_SERVICE,
  IAccountService,
} from './interfaces/account-service.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('accounts')
export class AccountController {
  constructor(
    @Inject(ACCOUNT_SERVICE)
    private readonly service: IAccountService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccountDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Public()
  @Post('register')
  register(@Body() dto: CreateAccountDto) {
    return this.service.create(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.service.refresh(dto);
  }

  @Patch(':id/role')
  changeRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.service.changeRole(id, dto);
  }
}
