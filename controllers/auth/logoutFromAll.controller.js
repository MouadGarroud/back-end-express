import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import logoutFromAllUseCase from '../../useCases/auth/logoutFromAll.useCase.js';
import { assertTokenExists } from '../../utils/assertTokenExists.util.js';

export async function logoutFromAllController(req, res) {
  try {
    const token = req.cookies?.accessToken;
    const currentIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || null;

    assertTokenExists(token, currentIp);

    await logoutFromAllUseCase(token);

    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(201).json({ message: RESPONSE_MESSAGES[SUCCESS_CODES.LOGOUT] });
  } catch (error) {
    throw error
  }
}

export default logoutFromAllController;
