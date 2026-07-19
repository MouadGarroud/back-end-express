import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import resetPasswordUseCase from '../../useCases/auth/resetPassword.useCase.js';

export async function resetPasswordController(req, res, next) {
  try {
    const rawToken = req.body.code;
    const password = req.body.newPassword;

    await resetPasswordUseCase(rawToken, password);

    res.status(201).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.RESET_PASSWORD],
    });
  } catch (err) {
    next(err);
  }
}

export default resetPasswordController;
