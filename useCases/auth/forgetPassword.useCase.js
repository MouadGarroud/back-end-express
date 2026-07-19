import mongoose from 'mongoose';
import AppError from '../../errors/appError.error.js';
import ERROR_CODES from '../../constants/errorCodes.constant.js';
import { findUserByIdentity } from '../../services/domain/user.service.js';
import { createResetToken } from '../../services/token/Token.service.js';
import generateRandomToken from '../../utils/generateRandomToken.utils.js';
import { sendTypedMail } from '../../services/mail/mail.service.js';
import TYPE_MAIL from '../../constants/typesMail.constant.js';
import env from '../../config/env.config.js';
import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import checkUserStatus from '../../utils/checkUserStatus.util.js';
import { assertUserExists } from '../../utils/assertValidUser.util.js';

export const forgetPasswordUseCase = async (email) => {
  const user = await findUserByIdentity({ email }, 'email status username ');

  assertUserExists(user);
  checkUserStatus(user.status);

  const userId = user._id;
  const expiresAt = Date.now() + Number(env.RESET_TOKEN_EXPIRES) * 1000;
  const length = Number(env.LENGTH_RESET_TOKEN);

  const { rawToken, hashedToken } = generateRandomToken(length);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await createResetToken(userId, hashedToken, expiresAt, { session });

    await sendTypedMail({
      type: TYPE_MAIL.RESET,
      to: user.email,
      payload: {
        username: user.username,
        rawToken,
      },
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    if (error.code !== 'MONGODB_ERROR') {
      console.error(`Failed to send password reset email to ${user.email}:`, error);
      throw new AppError(
        RESPONSE_MESSAGES[ERROR_CODES.MAIL_FAILED_TO_SEND],
        500,
        ERROR_CODES.MAIL_FAILED_TO_SEND,
      );
    }
    throw error;
  } finally {
    await session.endSession();
  }

  return { success: true };
};

export default forgetPasswordUseCase;
