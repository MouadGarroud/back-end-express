import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import logoutUseCase from '../../useCases/auth/logout.useCase.js';
import { assertTokenExists } from '../../utils/assertTokenExists.util.js';

export async function logoutController(req, res) {
  try {
    const token = req.cookies?.accessToken;
    assertTokenExists(token);

    await logoutUseCase(token);

    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(201).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.LOGOUT],
    });
  } catch (error) {
    throw error
  }
}

export default logoutController;
