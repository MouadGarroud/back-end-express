import AppError from '../../errors/appError.error.js';
import ERROR_CODES from '../../constants/errorCodes.constant.js';
import env from '../../config/env.config.js';
import generateJWT from '../../utils/generateJWT.util.js';
import verifyJWT from '../../utils/verifyJWT.util.js';
import {
  findSessionById,
  logout,
  logoutFromAll,
} from '../../services/JWT/jwt.service.js';
import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import assertIpMatches from '../../utils/assertIpMatches.util.js';
import {
  assertActiveSession,
  assertSessionExists,
  assertValidDataInSession,
} from '../../utils/assertValidSession.util.js';
import { assertEmailIsVerified } from '../../utils/assertValidUser.util.js';
import checkUserStatus from '../../utils/checkUserStatus.util.js';
import assertValidSessionPayload from '../../utils/assertValidSessionPayload.util.js';
import { findUserByIdentity } from '../../services/domain/user.service.js';
import assertRoleMatches from '../../utils/assertRoleMatches.utils.js';

export const refreshUseCase = async (token, currentIp, userAgent) => {
  try {
    const verify = verifyJWT(token, { ignoreExpiration: true });
    const { userId, role, sessionId, ip, exp } = verify;
    
    assertIpMatches(currentIp, ip);
    
    assertValidSessionPayload({ userId, role, sessionId });
    
    const session = await findSessionById(sessionId);
    assertSessionExists(session);
    
    assertValidDataInSession(session, { userId, currentIp }, userAgent);
    
    if (session.expiresAt.getTime() < Date.now()) {
      console.log(session.expiresAt)
      await logout(sessionId);
      throw new AppError(RESPONSE_MESSAGES[ERROR_CODES.SESSION_EXPIRED], 401, ERROR_CODES.SESSION_EXPIRED);
    }
    
    assertActiveSession(session);
    
  
    const user = await findUserByIdentity({ id: userId }, 'status emailVerified role');

    if (!user) {
          console.log(user)
      await logoutFromAll(userId);
      throw new AppError(RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED], 401, ERROR_CODES.SESSION_INVALID);
    }
    

    assertEmailIsVerified(user);

    // GUARD B: Immediate profile restriction enforcement
    if (user.status === 'banned' || user.status === 'suspended') {
      await logout(sessionId);
      checkUserStatus(user.status); // Uniformly throws your exact configured status exception
    }

    // GUARD C: Handle administrative role changes mid-session cleanly
    if (user.role !== role) {
      await logout(sessionId);
      throw new AppError(RESPONSE_MESSAGES[ERROR_CODES.UNAUTHORIZED], 401, ERROR_CODES.SESSION_INVALID);
    }
    assertRoleMatches(user.role, role); // Fixed: Passed clear fields instead of boolean expression

    // 4. Token Reuse Window Check (Early Return if current token is completely active)
    const currentTime = Math.floor(Date.now() / 1000);
    if (exp && exp > currentTime) {
      const expirationTime = new Date(exp * 1000).toLocaleTimeString();
      console.log('⏰ Token is still active! Expires At:', expirationTime);
      return { accessToken: token, userId, isNew: false };
    }

    // 5. Generate fresh new token payload values
    const accessPayload = { userId, role, sessionId, ip: currentIp };
    const accessExpire = Number(env.JWT_EXPIRES);
    const accessToken = generateJWT(accessPayload, accessExpire);

    return { accessToken, userId, isNew: true };
  } catch (error) {
    throw error;
  }
};

export default refreshUseCase;