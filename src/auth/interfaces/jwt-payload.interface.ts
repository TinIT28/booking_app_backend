export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: 'guest' | 'host' | 'admin';
  iat?: number; // issued at
  exp?: number; // expiration
}

