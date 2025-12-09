import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -----------------------------
  // CREATE USER
  // -----------------------------
  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return {
        success: true,
        statusCode: 201,
        message: 'User created successfully',
        data: user,
        meta: {},
        errors: null,
      };
    } catch (err) {
      throw new HttpException(
        {
          success: false,
          statusCode: err.status || 400,
          message: err.response?.message || 'Create user failed',
          data: null,
          meta: {},
          errors: err,
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // -----------------------------
  // GET ALL USERS (with pagination)
  // -----------------------------
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { data, total } = await this.usersService.findAll(page, limit);

    return {
      success: true,
      statusCode: 200,
      message: 'Users fetched successfully',
      data,
      meta: {
        page,
        limit,
        total,
      },
      errors: null,
    };
  }

  // -----------------------------
  // SEARCH USERS
  // -----------------------------
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    const result = await this.usersService.search(keyword);
    return {
      success: true,
      statusCode: 200,
      message: 'Search completed',
      data: result,
      meta: {},
      errors: null,
    };
  }

  // -----------------------------
  // GET USER BY ID
  // -----------------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new HttpException(
        {
          success: false,
          statusCode: 404,
          message: 'User not found',
          data: null,
          meta: {},
          errors: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      statusCode: 200,
      message: 'User found',
      data: user,
      meta: {},
      errors: null,
    };
  }

  // -----------------------------
  // UPDATE USER
  // -----------------------------
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const updated = await this.usersService.update(id, dto);

      return {
        success: true,
        statusCode: 200,
        message: 'User updated successfully',
        data: updated,
        meta: {},
        errors: null,
      };
    } catch (err) {
      throw new HttpException(
        {
          success: false,
          statusCode: err.status || 400,
          message: err.response?.message || 'Update failed',
          data: null,
          meta: {},
          errors: err,
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // -----------------------------
  // DELETE USER
  // -----------------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.usersService.remove(id);

    return {
      success: true,
      statusCode: 200,
      message: 'User deleted successfully',
      data: deleted,
      meta: {},
      errors: null,
    };
  }

  // -----------------------------
  // CHANGE PASSWORD
  // -----------------------------
  @Put(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    try {
      const result = await this.usersService.changePassword(
        id,
        body.oldPassword,
        body.newPassword,
      );

      return {
        success: true,
        statusCode: 200,
        message: 'Password changed successfully',
        data: result,
        meta: {},
        errors: null,
      };
    } catch (err) {
      throw new HttpException(
        {
          success: false,
          statusCode: err.status || 400,
          message: err.response?.message || 'Change password failed',
          data: null,
          meta: {},
          errors: err,
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
