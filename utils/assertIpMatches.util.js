import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';

/**
 * Asserts that the client's incoming IP address matches the IP stored in the active session.
 * @param {string} currentIp - The IP address from the current incoming request
 * @param {string} sessionIp - The IP address saved inside the database session document
 */
export const assertIpMatches = (currentIp, sessionIp) => {
  if (currentIp !== sessionIp) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      401,
      ERROR_CODES.IP_DIFFERENT,
    );
  }
};

export default assertIpMatches;
