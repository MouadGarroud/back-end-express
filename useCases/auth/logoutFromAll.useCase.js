import { findSessionById, logout, logoutFromAll } from '../../services/JWT/jwt.service.js';
import { findUserByIdentity } from '../../services/domain/user.service.js';
import verifyJWT from '../../utils/verifyJWT.util.js';
import checkUserStatus from '../../utils/checkUserStatus.util.js';
import { assertValidSessionPayload } from '../../utils/assertValidSessionPayload.util.js';
import assertRoleMatches from '../../utils/assertRoleMatches.utils.js';
import { assertActiveSession } from '../../utils/assertValidSession.util.js';
import assertIpMatches from '../../utils/assertIpMatches.util.js';
import { assertUserExists } from '../../utils/assertValidUser.util.js';

export const logoutFromAllUseCase = async (token, currentIp) => {
  try {
    const decoded = verifyJWT(token, { ignoreExpiration: true });
    const { userId, role, sessionId, ip } = decoded;
    if (currentIp !== ip ) logout(sessionId);
    assertIpMatches(currentIp, ip);
    assertValidSessionPayload({ userId, role, sessionId });

    const session = await findSessionById(sessionId);
    assertActiveSession(session);

    const user = await findUserByIdentity({ id: userId }, 'role status');

    if (!user) {
      await logoutFromAll(userId);
    }
    assertUserExists(user);

    try {
      checkUserStatus(user.status);
    } catch (statusError) {
      await logoutFromAll(userId);
      throw statusError;
    }

    if (user.role !== role) {
      return await logoutFromAll(userId);
    }

    assertRoleMatches(user.role, role);

    return await logoutFromAll(userId);
  } catch (error) {
    throw error;
  }
};

export default logoutFromAllUseCase;
