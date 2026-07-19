import AppError from '../errors/appError.error.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import {
  globalLimiterConfig,
  authLimiterConfig,
  registerLimiterConfig,
  emailSpamLimiterConfig,
} from '../config/rateLimit.config.js';
import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';

const createRateLimiterMiddleware = (config) => {
  return async (req, res, next) => {
    try {
      const targetIdentifier = req.body?.email || 'anonymous';
      const clientKey = `${req.ip}:${targetIdentifier}`;

      const { totalHits, resetTime } = await config.store.increment(clientKey);

      if (config.standardHeaders === 'draft-8') {
        res.setHeader('RateLimit-Limit', config.limit);
        res.setHeader('RateLimit-Remaining', Math.max(0, config.limit - totalHits));

        const deltaSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
        res.setHeader('RateLimit-Reset', Math.max(0, deltaSeconds));
      }

      if (totalHits > config.limit) {
        const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
        res.setHeader('Retry-After', Math.max(0, retryAfter));

        throw new AppError(
          RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
          429,
          ERROR_CODES.RATELIMIT,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const globalRateLimit = createRateLimiterMiddleware(globalLimiterConfig);
export const authRateLimit = createRateLimiterMiddleware(authLimiterConfig);
export const registerRateLimit = createRateLimiterMiddleware(registerLimiterConfig);
export const emailSpamRateLimit = createRateLimiterMiddleware(emailSpamLimiterConfig);
