import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guard.strategy';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // register
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // login with local guard (validateUser)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: LoginDto) {
    // req.user set by local strategy
    return this.authService.login(req);
  }

  // test protected route
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      success: true,
      statusCode: 200,
      message: 'Profile fetched',
      data: req.user,
    };
  }
}
