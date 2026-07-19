import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import resendActivationUseCase from '../../useCases/auth/resendActivation.useCase.js';

export async function resendActivationController(req, res, next) {
  try {
    const email = req.body.email;
    await resendActivationUseCase(email);
    res.status(201).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.RESEND_ACTIVATION],
    });
  } catch (err) {
    next(err);
  }
}

export default resendActivationController;
