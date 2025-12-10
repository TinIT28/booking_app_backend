import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './contants';
import { UsersService } from '../users/users.service';
import type { Request } from 'express';
import type { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = (req.body as { refresh_token?: string })
      ?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.usersService.findByIdWithRefreshTokens(payload.sub);

    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = user._id?.toString?.() ?? String(user._id);

    return {
      userId,
      email: user.email,
      role: user.role,
      refreshToken,
    };
  }
}
