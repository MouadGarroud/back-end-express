import ERROR_CODES from '../constants/errorCodes.constant.js';
import AppError from '../errors/appError.error.js';
import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    {
      body: req.body,
      params: req.params,
      query: req.query,
    },
    {
      abortEarly: false,
      allowUnknown: true,
    },
  );

  if (error) {
    const errorCode = error.details[0].message || ERROR_CODES.BAD_REQUEST;
    const userFriendlyMessage = RESPONSE_MESSAGES[errorCode] || 'Invalid input data.';

    return next(new AppError(userFriendlyMessage, 400, errorCode));
  }

  if (value.body) req.body = value.body;
  if (value.params) req.params = value.params;
  if (value.query) {
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, value.query);
  }
  next();
};

export default validate;
