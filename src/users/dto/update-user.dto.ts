import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsIn,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;

  @IsOptional()
  @Matches(/^[0-9]{9,15}$/, {
    message: 'Phone must contain 9–15 digits',
  })
  phone?: string;

  @IsOptional()
  @IsIn(['guest', 'host', 'admin'])
  role?: 'guest' | 'host' | 'admin';
}
