import ActivationToken from '../../models/ActivationToken.model.js';
import ResetToken from '../../models/resetToken.model.js';

export async function createActivationToken(user_id, hashedToken, expiresAt) {
  return ActivationToken.findOneAndUpdate(
    { user: user_id },
    {
      $set: {
        token: hashedToken,
        expiresAt: expiresAt,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    },
  );
}

export async function createResetToken(userId, hashedToken, expiresAt) {
  await ResetToken.deleteOne({ user: userId });
  return await ResetToken.create({
    user: userId,
    token: hashedToken,
    expiresAt: expiresAt,
  });
}

export async function findResetTokenById(resetTokenId) {
  return await ResetToken.findById(resetTokenId);
}

export async function deleteResetTokenById(resetTokenId) {
  return await ResetToken.deleteOne(resetTokenId);
}

export async function findResetToken(hashedToken) {
  return await ResetToken.findOne({ token: hashedToken });
}

export async function deleteResetTokensByUser(userId) {
  await ResetToken.deleteMany({ user: userId });
}

export async function deleteResetTokenByToken(hashedToken) {
  await ResetToken.deleteOne({ token: hashedToken });
}

export async function findActivationToken(hashedToken) {
  return await ActivationToken.findOne({ token: hashedToken });
}

export async function deleteActivationTokenByToken(hashedToken) {
  return await ActivationToken.deleteOne({ token: hashedToken });
}

export async function deleteActivationTokensByUser(userId) {
  await ActivationToken.deleteMany({ user: userId });
}
