import crypto from 'crypto';

const generateToken = (length) => {
  const rawToken = crypto.randomBytes(length).toString('hex');
  return rawToken;
};

export default generateToken;
