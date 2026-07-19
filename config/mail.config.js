import env from './env.config.js';

export const mailConfig = {
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  secure: env.MAIL_SECURE === 'true',
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
  from: env.MAIL_FROM,
};

export default mailConfig;
