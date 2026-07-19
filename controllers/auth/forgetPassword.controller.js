import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import forgetPasswordUseCase from '../../useCases/auth/forgetPassword.useCase.js';

export async function forgetPasswordController(req, res, next) {
  try {
    const email = req.body.email;
    await forgetPasswordUseCase(email);

    res.status(201).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.FORGET_PASSWORD],
    });
  } catch (err) {
    next(err);
  }
}

export default forgetPasswordController;
