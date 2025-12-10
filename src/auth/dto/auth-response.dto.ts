export interface UserResponseDto {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'guest' | 'host' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginResponseDto {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: UserResponseDto;
  };
}

export interface RegisterResponseDto {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: UserResponseDto;
    access_token: string;
    refresh_token: string;
  };
}

export interface RefreshTokenResponseDto {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface LogoutResponseDto {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}
