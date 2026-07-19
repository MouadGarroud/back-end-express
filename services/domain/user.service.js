import User from '../../models/User.model.js';
import ERROR_CODES from '../../constants/errorCodes.constant.js';
import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import AppError from '../../errors/appError.error.js';

export const findUserWithPasswordById = async (userId) => {
  return await User.findById(userId).select('id role status +password');
};

export const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

// register
export const findUserByEmailOrUsername = async (email, username) => {
  return await User.findOne({
    $or: [{ email }, { username }],
  }).select('username email');
};

// register & resend
export const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select('username email status role emailVerified');
};

export const createUser = async (data, options = {}) => {
  try {
    const [user] = await User.create([data], options);
    return user;
  } catch (err) {
    console.error('Error in createUser:', err);

    if (err.code === 11000) {
      const conflictField = Object.keys(err.keyValue || {})[0];

      const errorCode =
        conflictField === 'email'
          ? ERROR_CODES.EMAIL_ALREADY_EXISTS
          : ERROR_CODES.USERNAME_ALREADY_EXISTS;

      throw new AppError(RESPONSE_MESSAGES[errorCode], 409, errorCode);
    }

    throw err;
  }
};

export const activateAccount = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    { emailVerified: true },
    { returnDocument: 'after' },
  ).select('userId emailVerified');
};

export const findUserActivationStatus = async (userId) => {
  return await User.findById(userId).select('emailVerified role status');
};

export const findUserWithPasswordByEmail = async (email) => {
  return await User.findOne({ email }).select('+password');
};

export const resetPasswordByUser = async (userId, hashedPassword) => {
  await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { returnDocument: 'after' },
  );
};

/**
 * Finds a user by ID, email, or username dynamically.
 * @param {Object} identifiers - { id, email, username }
 * @param {string} [selectFields] - Optional Space-separated fields to select/project
 */
export const findUserByIdentity = async ({ id, email, username }, selectFields = '') => {
  const query = [];

  if (id) query.push({ _id: id });
  if (email) query.push({ email });
  if (username) query.push({ username });

  if (query.length === 0) return null;

  return await User.findOne(query.length > 1 ? { $or: query } : query[0]).select(
    selectFields,
  );
  console.log('find');
};
