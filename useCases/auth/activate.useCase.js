import mongoose from 'mongoose';
import {
  findActivationToken,
  deleteActivationTokenByToken,
} from '../../services/token/Token.service.js';
import {
  activateAccount,
  findUserByIdentity,
} from '../../services/domain/user.service.js';
import hashToken from '../../utils/hashToken.util.js';
import { assertEmailNotVerified } from '../../utils/assertValidUser.util.js';
import checkUserStatus from '../../utils/checkUserStatus.util.js';
import assertValidToken from '../../utils/assertValidToken.util.js';

export const activateUseCase = async (rawToken) => {
  const hashedToken = hashToken(rawToken);
  const activationToken = await findActivationToken(hashedToken);
  if (activationToken && activationToken.expiresAt.getTime() < Date.now()) {
    await activationToken.deleteOne();
  }
  assertValidToken(activationToken, 'ACTIVATION');
  const user = await findUserByIdentity(
    { id: activationToken.user },
    'emailVerified status',
  );
  assertEmailNotVerified(user);
  checkUserStatus(user.status);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await deleteActivationTokenByToken(hashedToken, { session });

    await activateAccount(activationToken.user, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default activateUseCase;
