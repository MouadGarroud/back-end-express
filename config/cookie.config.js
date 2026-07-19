import env from './env.config.js';

export const cookieConfig = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const TOKEN_LIFETIMES = {
  ACCESS_TOKEN_MS: 30 * 24 * 60 * 60 * 1000,
};

export default cookieConfig;
