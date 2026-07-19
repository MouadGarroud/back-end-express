import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

/**
 * Asserts that the user's current database role matches the role inside their session token.
 * @param {string} userRole - The role currently saved in the database
 * @param {string} sessionRole - The role decoded from the session/token payload
 */
export const assertRoleMatches = (userRole, sessionRole) => {
  if (userRole !== sessionRole) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      403,
      ERROR_CODES.ROLE_WAS_CHANGED,
    );
  }
};

export default assertRoleMatches;
