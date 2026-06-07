import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
