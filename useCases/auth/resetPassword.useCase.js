import {
  deleteActivationTokensByUser,
  deleteResetTokenByToken,
  findResetToken,
} from '../../services/token/Token.service.js';
import hashPassword from '../../utils/hashPassword.util.js';
import hashToken from '../../utils/hashToken.util.js';
import {
  resetPasswordByUser,
  findUserByIdentity,
  activateAccount,
} from '../../services/domain/user.service.js';
import mongoose from 'mongoose';
import { assertUserExists } from '../../utils/assertValidUser.util.js';
import assertValidToken from '../../utils/assertValidToken.util.js';
import checkUserStatus from '../../utils/checkUserStatus.util.js';
import { assertPasswordNotSameAsOld } from '../../utils/assertPasswordNotSameAsOld.util.js';

export const resetPasswordUseCase = async (rawToken, password) => {
  const hashedToken = hashToken(rawToken);

  const resetToken = await findResetToken(hashedToken);

  if (resetToken && resetToken.expiresAt.getTime() < Date.now()) {
    await resetToken.deleteOne();
  }

  assertValidToken(resetToken, 'RESET');
  const user = await findUserByIdentity(
    { id: resetToken.user },
    'emailVerified status password',
  );

  assertUserExists(user);
  checkUserStatus(user.status);

  await assertPasswordNotSameAsOld(password, user.password);

  const hashedPassword = await hashPassword(password);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await resetPasswordByUser(resetToken.user, hashedPassword, { session });
  
    await deleteResetTokenByToken(hashedToken, { session });

    await activateAccount(user._id);

    await deleteActivationTokensByUser(user._id);

    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default resetPasswordUseCase;
