import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // ---------------------------------------
  // CREATE USER
  // ---------------------------------------
  async create(dto: CreateUserDto): Promise<User> {
    try {
      // Check email exists manually
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) {
        throw new HttpException(
          {
            success: false,
            statusCode: 409,
            message: 'Email đã tồn tại',
            data: null,
            meta: {},
            errors: null,
          },
          HttpStatus.CONFLICT,
        );
      }

      const newUser = new this.userModel({
        ...dto,
        password: dto.password,
      });

      return await newUser.save();
    } catch (err) {
      // Handle Mongo E11000 duplicate
      if (err.code === 11000) {
        throw new HttpException(
          {
            success: false,
            statusCode: 409,
            message: 'Email đã tồn tại',
            data: null,
            meta: {},
            errors: err,
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        {
          success: false,
          statusCode: 400,
          message: err.message || 'Create user failed',
          data: null,
          meta: {},
          errors: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------------------------------------
  // FIND ALL USERS (PAGINATION)
  // ---------------------------------------
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return { data, total };
  }

  // ---------------------------------------
  // FIND USER BY ID
  // ---------------------------------------
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'User not found',
        data: null,
        meta: {},
        errors: null,
      });
    }

    return user;
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password');
  }

  // ---------------------------------------
  // FIND BY EMAIL
  // ---------------------------------------
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ---------------------------------------
  // SEARCH USER BY NAME / EMAIL / PHONE
  // ---------------------------------------
  async search(keyword: string): Promise<User[]> {
    if (!keyword || keyword.trim() === '') return [];

    return this.userModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ],
    });
  }

  // ---------------------------------------
  // UPDATE USER
  // ---------------------------------------
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      // Nếu update email -> check duplicate email
      if (dto.email) {
        const exists = await this.userModel.findOne({
          email: dto.email,
          _id: { $ne: id }, // exclude current user
        });
        if (exists) {
          throw new HttpException(
            {
              success: false,
              statusCode: 409,
              message: 'Email đã tồn tại',
              data: null,
              meta: {},
              errors: null,
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Hash password nếu có update
      if (dto.password) {
        const saltRounds = Number(process.env.BCRYPT_SALT || 10);
        dto.password = await bcrypt.hash(dto.password, saltRounds);
      }

      const updated = await this.userModel.findByIdAndUpdate(id, dto, {
        new: true,
      });

      if (!updated) {
        throw new NotFoundException({
          success: false,
          statusCode: 404,
          message: 'User not found',
          data: null,
          meta: {},
          errors: null,
        });
      }

      return updated;
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException(
          {
            success: false,
            statusCode: 409,
            message: 'Email đã tồn tại',
            data: null,
            meta: {},
            errors: err,
          },
          HttpStatus.CONFLICT,
        );
      }

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

  // ---------------------------------------
  // DELETE USER
  // ---------------------------------------
  async remove(id: string): Promise<User> {
    const deleted = await this.userModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'User not found',
        data: null,
        meta: {},
        errors: null,
      });
    }

    return deleted;
  }

  // ---------------------------------------
  // CHANGE PASSWORD
  // ---------------------------------------
  async changePassword(id: string, oldPw: string, newPw: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'User not found',
        data: null,
        meta: {},
        errors: null,
      });
    }

    const match = await bcrypt.compare(oldPw, user.password);
    if (!match) {
      throw new HttpException(
        {
          success: false,
          statusCode: 400,
          message: 'Old password is incorrect',
          data: null,
          meta: {},
          errors: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const saltRounds = Number(process.env.BCRYPT_SALT || 10);
    user.password = await bcrypt.hash(newPw, saltRounds);

    await user.save();

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
  }

  // ---------------------------------------
  // REFRESH TOKEN MANAGEMENT
  // ---------------------------------------
  async addRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { refreshTokens: refreshToken },
    });
  }

  async removeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
  }

  async removeAllRefreshTokens(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }

  async findByIdWithRefreshTokens(
    userId: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findById(userId).select('+refreshTokens');
  }
}
