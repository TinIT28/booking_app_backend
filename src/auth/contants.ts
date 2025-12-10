export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret_key',
  expiresIn: '3h', // 15 minutes for access token
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
  refreshExpiresIn: '7d', // 7 days for refresh token
};
