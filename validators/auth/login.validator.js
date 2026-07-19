import Joi from 'joi';
import ERROR_CODES from '../../constants/errorCodes.constant.js';

const loginValidator = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
      'any.required': ERROR_CODES.EMAIL_REQUIRED,
      'string.empty': ERROR_CODES.EMAIL_REQUIRED,
      'string.email': ERROR_CODES.EMAIL_INVALID,
    }),

    password: Joi.string().min(8).required().messages({
      'any.required': ERROR_CODES.PASSWORD_REQUIRED,
      'string.empty': ERROR_CODES.PASSWORD_REQUIRED,
      'string.min': ERROR_CODES.PASSWORD_TOO_SHORT,
      'string.max': ERROR_CODES.PASSWORD_TOO_LONG,
      'string.pattern.base': ERROR_CODES.PASSWORD_WEAK,
    }),
  }),
});

export default loginValidator;
