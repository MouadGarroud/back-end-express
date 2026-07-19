import Joi from 'joi';
import ERROR_CODES from '../../constants/errorCodes.constant.js';
import { isDisposableEmail } from '@visulima/disposable-email-domains';

const checkDisposableEmail = (email, helpers) => {
  if (isDisposableEmail(email)) {
    return helpers.error('string.disposable');
  }
  return email;
};

const registerValidator = Joi.object({
  body: Joi.object({
    username: Joi.string().trim().min(6).max(20).required().messages({
      'any.required': ERROR_CODES.USERNAME_REQUIRED,
      'string.empty': ERROR_CODES.USERNAME_REQUIRED,
      'string.min': ERROR_CODES.USERNAME_TOO_SHORT,
      'string.max': ERROR_CODES.USERNAME_TOO_LONG,
    }),

    firstName: Joi.string().trim().min(2).max(20).required().messages({
      'any.required': ERROR_CODES.FIRSTNAME_REQUIRED,
      'string.empty': ERROR_CODES.FIRSTNAME_REQUIRED,
      'string.min': ERROR_CODES.FIRSTNAME_TOO_SHORT,
      'string.max': ERROR_CODES.FIRSTNAME_TOO_LONG,
    }),

    lastName: Joi.string().trim().min(2).max(20).required().messages({
      'any.required': ERROR_CODES.LASTNAME_REQUIRED,
      'string.empty': ERROR_CODES.LASTNAME_REQUIRED,
      'string.min': ERROR_CODES.LASTNAME_TOO_SHORT,
      'string.max': ERROR_CODES.LASTNAME_TOO_LONG,
    }),

    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .custom(checkDisposableEmail)
      .required()
      .messages({
        'any.required': ERROR_CODES.EMAIL_REQUIRED,
        'string.empty': ERROR_CODES.EMAIL_REQUIRED,
        'string.email': ERROR_CODES.EMAIL_INVALID,
      }),

    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+-°])/)
      .required()
      .messages({
        'any.required': ERROR_CODES.PASSWORD_REQUIRED,
        'string.empty': ERROR_CODES.PASSWORD_REQUIRED,
        'string.min': ERROR_CODES.PASSWORD_TOO_SHORT,
        'string.max': ERROR_CODES.PASSWORD_TOO_LONG,
        'string.pattern.base': ERROR_CODES.PASSWORD_WEAK,
      }),
  }),
});

export default registerValidator;
