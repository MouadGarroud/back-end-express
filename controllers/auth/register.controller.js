import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import registerUseCase from '../../useCases/auth/register.useCase.js';

export async function registerController(req, res, next) {
  try {
    await registerUseCase({ ...req.body, avatar: req.file?.filename });
    res.status(201).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.REGISTER],
    });
  } catch (err) {
    next(err);
  }
}

export default registerController;
