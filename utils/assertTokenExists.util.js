import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

/**
 * Asserts that a token exists in the request payload or headers.
 * @param {string|null|undefined} token - The raw token string
 */
export const assertTokenExists = (token) => {
  if (!token) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      403,
      ERROR_CODES.JWT_INVALID,
    );
  }
};

