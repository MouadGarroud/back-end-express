import mongoose from 'mongoose';
import { createUser, findUserByIdentity } from '../../services/domain/user.service.js';

import { sendTypedMail } from '../../services/mail/mail.service.js';
import { createActivationToken } from '../../services/token/Token.service.js';

import TYPE_MAIL from '../../constants/typesMail.constant.js';
import env from '../../config/env.config.js';
import hashPassword from '../../utils/hashPassword.util.js';
import generateRandomToken from '../../utils/generateRandomToken.utils.js';
import assertUniqueField from '../../utils/assertUniqueField.util.js';

export const registerUseCase = async (data) => {
  const { username, email, password, firstName, lastName } = data;

  const exitUser = await findUserByIdentity({ email, username }, 'username email');
  assertUniqueField(exitUser, username, email);
  const hashedPassword = await hashPassword(password);

  const expiresAt = Date.now() + Number(env.ACTIVATION_TOKEN_EXPIRES) * 1000;
  const length = Number(env.LENGTH_ACTIVATION_TOKEN);
  const { rawToken, hashedToken } = generateRandomToken(length);
  const activationLink = `${env.APP_URL}/activate/${rawToken}`;

  const session = await mongoose.startSession();
  session.startTransaction();

  let user;

  try {
    user = await createUser(
      {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      { session },
    );

    await createActivationToken(user._id, hashedToken, expiresAt, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  try {
    await sendTypedMail({
      type: TYPE_MAIL.ACTIVATION,
      to: user.email,
      payload: {
        username: user.username,
        activationLink,
      },
    });
  } catch (mailError) {
    console.error(`Mail dispatch failed for ${user.email}:`, mailError);
  }

  return {
    username: user.username,
    link: activationLink,
  };
};

export default registerUseCase;
