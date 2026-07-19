import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

const assertUniqueField = (user, username, email) => {
  if (!user) return;

  if (user.username === username) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.USERNAME_ALREADY_EXISTS],
      409,
      ERROR_CODES.USERNAME_ALREADY_EXISTS,
    );
  }

  if (user.email === email) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.EMAIL_ALREADY_EXISTS],
      409,
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
    );
  }
};

export default assertUniqueField;
