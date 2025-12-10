export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  user: {
    _id: string | any;
    email: string;
    name: string;
    role: string;
    phone?: string;
  };
}

