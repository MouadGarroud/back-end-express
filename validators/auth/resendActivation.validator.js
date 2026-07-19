import Joi from 'joi';
import ERROR_CODES from '../../constants/errorCodes.constant.js';

const resendActivationValidator = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
      'any.required': ERROR_CODES.EMAIL_REQUIRED,
      'string.empty': ERROR_CODES.EMAIL_REQUIRED,
      'string.email': ERROR_CODES.EMAIL_INVALID,
    }),
  }),
});
export default resendActivationValidator;
