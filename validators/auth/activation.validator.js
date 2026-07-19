import Joi from 'joi';
import ERROR_CODES from '../../constants/errorCodes.constant.js';

const activationValidator = Joi.object({
  params: Joi.object({
    token: Joi.string().trim().length(64).required().messages({
      'any.required': ERROR_CODES.ACTIVATION_TOKEN_REQUIRED,
      'string.empty': ERROR_CODES.ACTIVATION_TOKEN_REQUIRED,
      'string.length': ERROR_CODES.ACTIVATION_TOKEN_INVALID,
    }),
  }),
});

export default activationValidator;
