import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // validate user for local strategy
  async validateUser(email: string, password: string) {
    const user = (await this.usersService.findByEmailWithPassword(
      email,
    )) as UserDocument;
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // remove sensitive fields
      const { password: pw, ...result } = user.toObject
        ? user.toObject()
        : user;
      return result;
    }
    return null;
  }

  async login(req: any) {
    const { user } = req;
    // user passed from validated auth (email/password)
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    return {
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        access_token: this.jwtService.sign(payload),
        user: user,
      },
    };
  }

  async register(createUserDto: any) {
    // ensure UsersService handles duplicate email error and returns proper exception
    // hash password before create
    const created = (await this.usersService.create(
      createUserDto,
    )) as UserDocument;
    const { password, ...userSafe } = created.toObject
      ? created.toObject()
      : created;
    const token = this.jwtService.sign({
      sub: userSafe._id,
      email: userSafe.email,
      role: userSafe.role,
    });
    return {
      success: true,
      statusCode: 201,
      message: 'User created',
      data: { user: userSafe, access_token: token },
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
