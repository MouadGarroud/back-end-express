import rateLimit from 'express-rate-limit'; // Fixed: Added missing import
import createUpstashStore from './redis.config.js';
import AppError from '../errors/appError.error.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.constant.js';

const rateLimitHandler = (customErrorCode) => (req, res, next) => {
  const userFriendlyMessage =
    RESPONSE_MESSAGES[customErrorCode] || 'Too many requests. Please slow down.';
  return next(new AppError(userFriendlyMessage, 429, customErrorCode));
};

export const globalLimiterConfig = {
  // store: createUpstashStore("ratelimit:global:", 1 * 60),
  // windowMs: 1 * 60 * 1000,
  // limit: 1,
  // standardHeaders: "draft-8",
  // legacyHeaders: false,
  store: createUpstashStore('ratelimit:register:', 1 * 60),
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler(ERROR_CODES.RATELIMIT_GLOBAL),
};

export const authLimiterConfig = {
  // store: createUpstashStore("ratelimit:auth:", 15 * 60),
  // windowMs: 15 * 60 * 1000,
  // limit: 5,
  // standardHeaders: "draft-8",
  // legacyHeaders: false,
  store: createUpstashStore('ratelimit:register:', 1 * 60),
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler(ERROR_CODES.RATELIMIT_LOGIN),
};

export const registerLimiterConfig = {
  store: createUpstashStore('ratelimit:register:', 1 * 60),
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler(ERROR_CODES.RATELIMIT_REGISTER),
};

export const emailSpamLimiterConfig = {
  // store: createUpstashStore("ratelimit:email:", 5 * 60),
  // windowMs: 5 * 60 * 1000,
  // limit: 2,
  // standardHeaders: "draft-8",
  // legacyHeaders: false,
  store: createUpstashStore('ratelimit:register:', 1 * 60),
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler(ERROR_CODES.RATELIMIT_EMAIL),
};

export const globalLimiter = rateLimit(globalLimiterConfig);
