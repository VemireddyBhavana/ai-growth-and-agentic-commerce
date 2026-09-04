import { env } from './env.config.js';

/**
 * JWT Authentication Configuration Options
 */
export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
  refreshSecret: env.JWT_REFRESH_SECRET || env.JWT_SECRET,
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  issuer: 'ai-sales-assistant-api',
  audience: 'ai-sales-assistant-client',
};
