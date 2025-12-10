import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './contants';
import { UsersService } from '../users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // payload = { sub: userId, email, role }
    const user = (await this.usersService.findById(
      payload.sub,
    )) as UserDocument;
    if (!user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userSafe } = user.toObject ? user.toObject() : user;
    // Return with userId for consistency
    return {
      userId: payload.sub,
      ...userSafe,
    }; // attaches to req.user
  }
}
