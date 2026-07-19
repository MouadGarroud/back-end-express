import AppError from '../errors/appError.error.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';

const notFound = (req, res, next) => {
  next(
    new AppError(RESPONSE_MESSAGES[ERROR_CODES.NOT_FOUND], 404, ERROR_CODES.NOT_FOUND),
  );
};

export default notFound;
