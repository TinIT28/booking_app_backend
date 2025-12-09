import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  // optional fields
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['guest', 'host', 'admin'])
  role?: 'guest' | 'host' | 'admin';
}
