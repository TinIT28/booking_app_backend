import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

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
  passwordHash: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
