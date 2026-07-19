import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import AppError from '../errors/appError.error.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';

export const verifyJWT = (token, options = {}) => {
  try {
    return jwt.verify(token, env.JWT_SECRET, options);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(
        RESPONSE_MESSAGES[ERROR_CODES.JWT_EXPIRED],
        401,
        ERROR_CODES.JWT_EXPIRED,
      );
    }

    if (
      error.name === 'JsonWebTokenError' &&
      error.message.toLowerCase().includes('signature')
    ) {
      throw new AppError(
        RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
        401,
        ERROR_CODES.INVALID_SIGNATURE,
      );
    }

    if (error.name === 'JsonWebTokenError') {
      throw new AppError(
        RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
        400,
        ERROR_CODES.JSON_WEB_TOKEN_ERROR,
      );
    }

    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      500,
      ERROR_CODES.TOKEN_VERIFICATION_FAILED,
    );
  }
};

export default verifyJWT;
