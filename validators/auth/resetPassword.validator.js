import Joi from 'joi';
import ERROR_CODES from '../../constants/errorCodes.constant.js';

const resetPasswordValidator = Joi.object({
  body: Joi.object({
    code: Joi.string().trim().length(6).required().messages({
      'any.required': ERROR_CODES.RESET_TOKEN_REQUIRED,
      'string.empty': ERROR_CODES.RESET_TOKEN_REQUIRED,
      'string.length': ERROR_CODES.RESET_TOKEN_INVALID,
    }),
    newPassword: Joi.string().min(8).required().messages({
      'any.required': ERROR_CODES.PASSWORD_REQUIRED,
      'string.empty': ERROR_CODES.PASSWORD_REQUIRED,
      'string.min': ERROR_CODES.PASSWORD_TOO_SHORT,
    }),
  }),
});

export default resetPasswordValidator;
