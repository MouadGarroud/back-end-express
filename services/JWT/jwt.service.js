import Session from '../../models/session.model.js';

export const createSession = async (userId, userAgent, deviceIp, expiresAt) => {
  await Session.deleteMany({
    userId,
    deviceIp,
    userAgent,
  });

  return await Session.create({
    userId,
    deviceIp,
    userAgent,
    expiresAt,
  });
};

export const findSessionById = async (sessionId) => {
  return await Session.findById(sessionId);
};

export const logout = async (sessionId) => {
  return await Session.findByIdAndDelete(sessionId);
};

export const logoutFromAll = async (userId) => {
  return await Session.deleteMany({ userId: userId });
};
