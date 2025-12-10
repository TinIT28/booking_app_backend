import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // validate email
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
    select: false, // không trả password khi query
  })
  password: string;

  @Prop({
    required: false,
    trim: true,
    match: /^[0-9]{9,15}$/, // số điện thoại
  })
  phone: string;

  @Prop({
    default: 'guest',
    enum: ['guest', 'host', 'admin'], // chỉ cho phép 3 role
  })
  role: 'guest' | 'host' | 'admin';

  @Prop({
    type: [String],
    default: [],
    select: false, // không trả refresh tokens khi query
  })
  refreshTokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// pre save hook to ensure hashed password if it's modified
UserSchema.pre('save', async function () {
  const user = this as UserDocument;

  if (!user.isModified('password')) return;

  const saltRounds = Number(process.env.BCRYPT_SALT || 10);
  user.password = await bcrypt.hash(user.password, saltRounds);
});

// instance method to compare
UserSchema.methods.comparePassword = async function (plain: string) {
  return bcrypt.compare(plain, this.password);
};
