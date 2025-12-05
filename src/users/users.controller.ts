import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { successResponse } from 'src/common/helpers/response.helper';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.service.create(dto);
    return successResponse(user, 'Tạo user thành công', 201);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
