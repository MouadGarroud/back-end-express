import bcrypt from 'bcrypt';
import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

export const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (!isMatch) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.LOGIN_FAILED],
      400,
      ERROR_CODES.LOGIN_FAILED,
    );
  }
};

export default comparePassword;
