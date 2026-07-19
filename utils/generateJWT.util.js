import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';

const generateJWT = (AccessPayload, AccessExpire) => {
  return jwt.sign(AccessPayload, env.JWT_SECRET, { expiresIn: Number(AccessExpire) });
};

export default generateJWT;
