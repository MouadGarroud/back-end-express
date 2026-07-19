import generateToken from './generateToken.util.js';
import hashToken from './hashToken.util.js';

export function generateRandomToken(length) {
  const rawToken = generateToken(length);
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
}

export default generateRandomToken;
