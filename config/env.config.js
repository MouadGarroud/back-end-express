import dotenv from 'dotenv';

dotenv.config();

const env = {
  APP_URL: process.env.APP_URL,
  NODE_ENV: process.env.NODE_ENV,
  SERVER_PORT: process.env.SERVER_PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_SECURE: process.env.MAIL_SECURE,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM,

  JWT_EXPIRES: process.env.JWT_EXPIRES,
  JWT_RESEND_EXPIRES: process.env.JWT_RESEND_EXPIRES,

  ACTIVATION_TOKEN_EXPIRES: process.env.ACTIVATION_TOKEN_EXPIRES,
  RESET_TOKEN_EXPIRES: process.env.RESET_TOKEN_EXPIRES,
  LENGTH_ACTIVATION_TOKEN: process.env.LENGTH_ACTIVATION_TOKEN,
  LENGTH_RESET_TOKEN: process.env.LENGTH_RESET_TOKEN,
};

export default env;
