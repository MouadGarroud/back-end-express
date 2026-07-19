import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

const checkUserStatus = (status) => {
  const invalidStatuses = {
    banned: ERROR_CODES.BANNED,
    suspended: ERROR_CODES.SUSPENDED,
  };

  const errorCode = invalidStatuses[status];

  if (errorCode) {
    throw new AppError(RESPONSE_MESSAGES[errorCode], 403, errorCode);
  }

  // Returning nothing (undefined) or true implies the user is cleared
};

export default checkUserStatus;
