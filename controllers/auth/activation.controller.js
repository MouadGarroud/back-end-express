import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import activateUseCase from '../../useCases/auth/activate.useCase.js';

export async function activationController(req, res, next) {
  try {
    await activateUseCase(req.params.token);
    res.status(200).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.ACTIVATION],
    });
  } catch (err) {
    next(err);
  }
}

export default activationController;
