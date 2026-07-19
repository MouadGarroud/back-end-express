import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

export const assertValidToken = (tokenDoc, tokenType) => {
  if (!tokenDoc) {
    const notFoundCode = ERROR_CODES[`${tokenType}_TOKEN_NOT_FOUND`];
    throw new AppError(RESPONSE_MESSAGES[notFoundCode], 400, notFoundCode);
  }

  if (tokenDoc.expiresAt.getTime() < Date.now()) {
    const expiredCode = ERROR_CODES[`${tokenType}_TOKEN_EXPIRED`];
    throw new AppError(RESPONSE_MESSAGES[expiredCode], 400, expiredCode);
  }
};

export default assertValidToken;
