import ERROR_CODES from '../constants/errorCodes.constant.js'; 

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const userFriendlyMessage = err.message || 'Something went wrong.';
  
  const securityErrors = [
    ERROR_CODES.SESSION_EXPIRED,
    ERROR_CODES.IP_DIFFERENT,
    ERROR_CODES.JWT_INVALID,
    ERROR_CODES.SESSION_INVALID,
    ERROR_CODES.BANNED,
    ERROR_CODES.SUSPENDED,
    ERROR_CODES.ROLE_WAS_CHANGED,
    ERROR_CODES.ROLE_INVALID,
    ERROR_CODES.INVALID_SIGNATURE,
    ERROR_CODES.JSON_WEB_TOKEN_ERROR,
  ];

  if (securityErrors.includes(code)) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  console.log('====================================');
  console.error('🔥 ERROR LOG:', err.message);
  console.log('📊 Status Code:', statusCode);
  console.log('🔑 Error Code:', code);
  console.log('====================================');

  return res.status(statusCode).json({
    
    message: userFriendlyMessage,
  });
};

export default errorHandler;