import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './contants';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type {
  LoginResponseDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';
import type { JwtPayload, LoginRequest } from './dto/jwt-payload.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // validate user for local strategy
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserResponseDto, 'password'> | null> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    const userDoc = user as any;
    const userObj = userDoc.toObject ? userDoc.toObject() : userDoc;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...rest } = userObj;
    const safeUser: Omit<UserResponseDto, 'password'> = {
      _id: String(rest._id),
      name: rest.name,
      email: rest.email,
      role: rest.role,
      phone: rest.phone,
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
    return safeUser;
  }

  async login(req: LoginRequest): Promise<LoginResponseDto> {
    const { user } = req;
    const userId = String((user as any)._id);

    const payload: JwtPayload = {
      sub: userId,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn as any,
    });

    // Save refresh token to database
    await this.usersService.addRefreshToken(userId, refreshToken);

    return {
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          _id: userId,
          name: user.name,
          email: user.email,
          role: user.role as 'guest' | 'host' | 'admin',
          phone: user.phone,
        },
      },
    };
  }

  async register(createUserDto: RegisterDto): Promise<RegisterResponseDto> {
    // ensure UsersService handles duplicate email error and returns proper exception
    // hash password before create
    const created = await this.usersService.create(createUserDto);

    // Convert to plain object and remove password
    const createdDoc = created as any;
    const createdObj = createdDoc.toObject ? createdDoc.toObject() : createdDoc;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...userSafe } = createdObj;

    const userId = String(userSafe._id);

    const payload: JwtPayload = {
      sub: userId,
      email: userSafe.email,
      role: userSafe.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn as any,
    });

    // Save refresh token to database
    await this.usersService.addRefreshToken(userId, refreshToken);

    return {
      success: true,
      statusCode: 201,
      message: 'User created',
      data: {
        user: {
          _id: userId,
          name: userSafe.name,
          email: userSafe.email,
          role: userSafe.role,
          phone: userSafe.phone,
          createdAt: userSafe.createdAt,
          updatedAt: userSafe.updatedAt,
        },
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshTokens(refreshToken: string): Promise<RefreshTokenResponseDto> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });

      // Check if refresh token exists in database
      const user = await this.usersService.findByIdWithRefreshTokens(
        payload.sub,
      );

      if (!user || !user.refreshTokens?.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const userId = String((user as any)._id);

      const newPayload: JwtPayload = {
        sub: userId,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiresIn as any,
      });

      // Remove old refresh token and add new one
      await this.usersService.removeRefreshToken(userId, refreshToken);
      await this.usersService.addRefreshToken(userId, newRefreshToken);

      return {
        success: true,
        statusCode: 200,
        message: 'Tokens refreshed successfully',
        data: {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(
    userId: string,
    refreshToken: string,
  ): Promise<LogoutResponseDto> {
    try {
      // Remove the specific refresh token
      await this.usersService.removeRefreshToken(userId, refreshToken);

      return {
        success: true,
        statusCode: 200,
        message: 'Logged out successfully',
        data: null,
      };
    } catch {
      throw new UnauthorizedException('Logout failed');
    }
  }

  async logoutAll(userId: string): Promise<LogoutResponseDto> {
    try {
      // Remove all refresh tokens
      await this.usersService.removeAllRefreshTokens(userId);

      return {
        success: true,
        statusCode: 200,
        message: 'Logged out from all devices successfully',
        data: null,
      };
    } catch {
      throw new UnauthorizedException('Logout failed');
    }
  }
}
