import bcrypt from 'bcrypt';
import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

export const assertPasswordNotSameAsOld = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (isMatch) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.SAME_AS_OLD_PASSWORD],
      400,
      ERROR_CODES.SAME_AS_OLD_PASSWORD,
    );
  }
};

export default assertPasswordNotSameAsOld;
