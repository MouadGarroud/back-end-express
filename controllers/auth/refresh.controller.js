import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';
import refreshUseCase from '../../useCases/auth/refresh.useCase.js';
import cookieConfig from '../../config/cookie.config.js';
import SUCCESS_CODES from '../../constants/successCodes.constant.js';
import { assertTokenExists } from '../../utils/assertTokenExists.util.js';

export const refreshController = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    assertTokenExists(token);

    const currentIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || null;
    const userAgent = req.headers['user-agent'];

    const result = await refreshUseCase(token, currentIp, userAgent);
    if (!result.isNew) {
      return res.status(200).json({
        message: "The access token is still active and valid."
      });

    } res.cookie('accessToken', result.accessToken, {
      ...cookieConfig,
    });

    return res.status(200).json({
      message: RESPONSE_MESSAGES[SUCCESS_CODES.REFRESH_TOKEN],
    });
  } catch (err) {
    next(err);
  }
};
