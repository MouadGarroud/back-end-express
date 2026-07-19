import crypto from 'crypto';

export const hashToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};
export default hashToken;
