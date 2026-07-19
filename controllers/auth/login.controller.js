import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import loginUseCase from '../../useCases/auth/login.useCase.js';
import { cookieConfig, TOKEN_LIFETIMES } from '../../config/cookie.config.js';

export async function loginController(req, res, next) {
  const { email, password } = req.body;

  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || null;
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const data = { email, password, ip, userAgent };

    const { accessToken } = await loginUseCase(data);

    res.cookie('accessToken', accessToken, {
      ...cookieConfig,
      maxAge: TOKEN_LIFETIMES.ACCESS_TOKEN_MS,
    });

    res.status(201).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.LOGIN],
    });
  } catch (err) {
    next(err);
  }
}

export default loginController;
