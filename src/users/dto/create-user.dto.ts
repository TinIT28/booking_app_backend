import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Matches,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
  password: string;

  @IsOptional()
  @Matches(/^[0-9]{9,15}$/, { message: 'SĐT không hợp lệ' })
  phone?: string;

  @IsOptional()
  @IsIn(['guest', 'host', 'admin'])
  role?: 'guest' | 'host' | 'admin';
}
