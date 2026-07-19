import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

export const assertUserExists = (user) => {
  if (!user) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.USER_NOT_FOUND],
      400,
      ERROR_CODES.USER_NOT_FOUND,
    );
  }
};

// login
export const assertEmailIsVerified = (user) => {
  assertUserExists(user);
  if (!user.emailVerified) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.ACCOUNT_NOT_ACTIVATED],
      400,
      ERROR_CODES.ACCOUNT_NOT_ACTIVATED,
    );
  }
};

// resend activation
export const assertEmailNotVerified = (user) => {
  assertUserExists(user);
  if (user.emailVerified) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.ACCOUNT_ALREADY_ACTIVATED],
      400,
      ERROR_CODES.ACCOUNT_ALREADY_ACTIVATED,
    );
  }
};
