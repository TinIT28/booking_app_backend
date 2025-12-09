export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || 3600,
};
