import comparePassword from '../../utils/comparePassword.util.js';
import env from '../../config/env.config.js';
import generateJWT from '../../utils/generateJWT.util.js';
import { createSession } from '../../services/JWT/jwt.service.js';
import checkUserStatus from '../../utils/checkUserStatus.util.js';
import { assertEmailIsVerified } from '../../utils/assertValidUser.util.js';
import { findUserByIdentity } from '../../services/domain/user.service.js';

export const loginUseCase = async (data) => {
  try {
    const { email, password, ip, userAgent } = data;

    const user = await findUserByIdentity(
      { email },
      'email emailVerified status role password',
    );
    assertEmailIsVerified(user);
    checkUserStatus(user.status);

    await comparePassword(password, user.password);

    const userId = user._id;
    const role = user.role;
    const daysToExpire = 30;
    const expiresAt = new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000);

    const savedSession = await createSession(userId, userAgent, ip, expiresAt);
    const sessionId = savedSession._id;

    const accessPayload = {
      userId,
      role,
      sessionId,
      ip,
    };

    const accessExpire = Number(env.JWT_EXPIRES);
    const accessToken = generateJWT(accessPayload, accessExpire);

    return {
      accessToken,
    };
  } catch (error) {
    throw error;
  }
};

export default loginUseCase;
