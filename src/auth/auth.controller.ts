import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guard.strategy';
import { JwtAuthGuard } from './jwt.guard';
import type { LoginRequest } from './dto/jwt-payload.dto';
import type {
  LoginResponseDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
} from './dto/auth-response.dto';
import type { AuthenticatedRequest } from './dto/authenticated-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // register
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  // login with local guard (validateUser)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: LoginRequest): Promise<LoginResponseDto> {
    // req.user set by local strategy
    return this.authService.login(req);
  }

  // refresh tokens
  @Post('refresh-token')
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshTokens(dto.refresh_token);
  }

  // logout from current device
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Request() req: AuthenticatedRequest,
    @Body() dto: RefreshTokenDto,
  ): Promise<LogoutResponseDto> {
    return this.authService.logout(req.user.userId, dto.refresh_token);
  }

  // logout from all devices
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(
    @Request() req: AuthenticatedRequest,
  ): Promise<LogoutResponseDto> {
    return this.authService.logoutAll(req.user.userId);
  }

  // test protected route
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return {
      success: true,
      statusCode: 200,
      message: 'Profile fetched',
      data: req.user,
    };
  }
}
