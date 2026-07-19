import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';
import assertIpMatches from './assertIpMatches.util.js';

/**
 * Asserts that a retrieved session exists and is valid.
 * @param {Object|null} sessionDoc - The database session document
 */
export const assertSessionExists = (sessionDoc) => {
  if (!sessionDoc) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      401,
      ERROR_CODES.SESSION_INVALID,
    );
  }
};

export const assertActiveSession = (sessionDoc) => {
  assertSessionExists(sessionDoc);

  if (sessionDoc.expiresAt.getTime() < Date.now()) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.SESSION_EXPIRED],
      401,
      ERROR_CODES.SESSION_EXPIRED,
    );
  }
};

/**
 * Asserts that the session context saved in the database matches the incoming token context.
 * @param {Object} session - The active session document from the database
 * @param {Object} tokenPayload - The decoded data from the incoming JWT
 * @param {string} incomingUserAgent - The current request's user-agent header string
 */
export const assertValidDataInSession = (session, { userId, currentIp }, incomingUserAgent) => {
  if (session.userId.toString() !== userId.toString()) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      401,
      ERROR_CODES.USER_ID_INVALID, 
    );
  }
  assertIpMatches(currentIp, session.deviceIp);

  if (session.userAgent !== incomingUserAgent) {
    throw new AppError(
      RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      401,
      ERROR_CODES.USER_AGENT_DIFFERENT,
    );
  }
};