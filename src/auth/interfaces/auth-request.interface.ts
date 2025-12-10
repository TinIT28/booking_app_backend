import { Request } from 'express';

export interface AuthenticatedUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'guest' | 'host' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest extends Request {
  user: AuthenticatedUser;
}

export interface JwtAuthRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: 'guest' | 'host' | 'admin';
    [key: string]: any;
  };
}

