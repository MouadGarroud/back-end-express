import verifyJWT from '../utils/verifyJWT.util.js';
import { assertTokenExists } from '../utils/assertTokenExists.util.js';
import { assertIpMatches } from '../utils/assertIpMatches.util.js';

export const protect = async (req, res, next) => {
  try {
    
    const token = req.cookies?.accessToken;
    assertTokenExists(token);
    const decoded = verifyJWT(token);
    const expirationTime = new Date(decoded.exp * 1000).toLocaleTimeString();
    console.log('⏰ Token Expires At:', expirationTime);
    const clientIp = req.headers['X-Forwarded-For']?.split(',')[0].trim() || req.ip;
    assertIpMatches(clientIp, decoded.ip);
    req.userId = decoded.userId;
    req.role = decoded.role;
    req.sessionId = decoded.sessionId;
    req.clientIp = clientIp;

    next();
  } catch (err) {
    next(err);
  }
};

export default protect;