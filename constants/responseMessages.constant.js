import ERROR_CODES from './errorCodes.constant.js';
import SUCCESS_CODES from './successCodes.constant.js';

export const RESPONSE_MESSAGES = {
  // --- Generic & Server Responses ---
  [ERROR_CODES.INTERNAL_SERVER_ERROR]:
    'Something went wrong on our end. Please try again later.',
  [ERROR_CODES.BAD_REQUEST]: 'Invalid request parameters. Please check your data.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource could not be found.',
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ERROR_CODES.FORBIDDEN]:
    'Access denied. You do not have permission to continue this request.',
  [ERROR_CODES.CONFLICT]: 'A conflict occurred with the current state of the resource.',
  [ERROR_CODES.RATELIMIT]: 'Too many requests. Please slow down and try again later.',
  [ERROR_CODES.USER_NOT_FOUND]: 'No account found with these details.',
  [ERROR_CODES.BANNED]:
    'Your account has been banned. Please check your email for more details or contact support.',
  [ERROR_CODES.SUSPENDED]:
    'Your account has been suspended. Please check your email for more details or contact support.',
  [ERROR_CODES.AVATAR_SIZE]: 'File size is too large. Maximum limit is 5MB.', // Fixed code reference
  [ERROR_CODES.AVATAR_FORMAT]:
    'Invalid file format. Only JPEG, JPG, and PNG are allowed.', // Fixed code reference
  [ERROR_CODES.LIMIT_UNEXPECTED_AVATAR]: 'You can only upload 1 avatar image at a time.',
  [ERROR_CODES.MAIL_FAILED_TO_SEND]: 'Failed to send the email. Please try again later.',
  [ERROR_CODES.ROLE_WAS_CHANGED]: 'The role was changed.', // Fixed code reference
  // --- Validation Responses ---
  [ERROR_CODES.USERNAME_REQUIRED]: 'Username is required.',
  [ERROR_CODES.USERNAME_TOO_SHORT]: 'Username must be at least 6 characters long.',
  [ERROR_CODES.USERNAME_TOO_LONG]: 'Username cannot exceed 20 characters.',
  [ERROR_CODES.USERNAME_ALREADY_EXISTS]: 'This username is already taken.',

  [ERROR_CODES.FIRSTNAME_REQUIRED]: 'First name is required.',
  [ERROR_CODES.FIRSTNAME_TOO_SHORT]: 'First name must be at least 2 characters long.',
  [ERROR_CODES.FIRSTNAME_TOO_LONG]: 'First name cannot exceed 30 characters.',

  [ERROR_CODES.LASTNAME_REQUIRED]: 'Last name is required.',
  [ERROR_CODES.LASTNAME_TOO_SHORT]: 'Last name must be at least 2 characters long.',
  [ERROR_CODES.LASTNAME_TOO_LONG]: 'Last name cannot exceed 30 characters.',

  [ERROR_CODES.EMAIL_REQUIRED]: 'Email address is required.',
  [ERROR_CODES.EMAIL_INVALID]: 'Please enter a valid email address.',
  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: 'This email address is already registered.',

  [ERROR_CODES.PASSWORD_REQUIRED]: 'Password is required.',
  [ERROR_CODES.PASSWORD_TOO_SHORT]: 'Password must be at least 8 characters long.',
  [ERROR_CODES.PASSWORD_TOO_LONG]: 'Password cannot exceed 128 characters.',
  [ERROR_CODES.PASSWORD_WEAK]:
    'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  [ERROR_CODES.SAME_AS_OLD_PASSWORD]:
    'Your new password cannot be the same as your old password.',

  // --- Authentication Process Responses ---
  [ERROR_CODES.REGISTER_FAILED]:
    'Registration failed. Please double-check your inputs and try again.',
  [SUCCESS_CODES.REGISTER]:
    'Registration completed successfully! Please check your inbox to activate your account.',

  [ERROR_CODES.LOGIN_FAILED]: 'Invalid email or password. Please try again.',
  [SUCCESS_CODES.LOGIN]: 'Welcome back! You have logged in successfully.',
  [ERROR_CODES.ACCOUNT_NOT_ACTIVATED]:
    'Your account has not been activated yet. Please check your email.',

  // --- Account Activation Responses ---
  [ERROR_CODES.ACTIVATION_TOKEN_REQUIRED]: 'Activation token is required.',
  [ERROR_CODES.ACTIVATION_TOKEN_INVALID]: 'The activation link is invalid.',
  [ERROR_CODES.ACTIVATION_TOKEN_EXPIRED]:
    'Your activation link has expired. Please request a new one.',
  [ERROR_CODES.ACTIVATION_TOKEN_NOT_FOUND]: 'Invalid or already used activation token.',
  [ERROR_CODES.ACCOUNT_ALREADY_ACTIVATED]:
    'Your account is already activated. You can log in.',
  [SUCCESS_CODES.ACTIVATION]:
    'Your account has been successfully activated! You can now log in.',
  [SUCCESS_CODES.RESEND_ACTIVATION]:
    'A new activation link has been successfully sent to your email.',

  // --- Password Reset Responses ---
  [ERROR_CODES.FORGET_PASSWORD_FAILED]:
    'Failed to process the password reset request. Please try again.',
  [SUCCESS_CODES.FORGET_PASSWORD]:
    'A password reset link has been sent to your email. Please check your inbox.',
  [ERROR_CODES.RESEND_FORGET_PASSWORD_FAILED]:
    'Failed to resend the password reset email.',
  [SUCCESS_CODES.RESEND_FORGET_PASSWORD]:
    'The password reset link has been resent successfully. Please check your inbox.',

  [SUCCESS_CODES.RESET_PASSWORD]:
    'Your password has been successfully reset. You can now log in with your new password.',
  [ERROR_CODES.RESET_PASSWORD_FAILED]:
    'The password reset operation failed. Please try again.',
  [ERROR_CODES.RESET_TOKEN_REQUIRED]: 'The password reset token is required.',
  [ERROR_CODES.RESET_TOKEN_INVALID]: 'The reset token is invalid or incorrect.',
  [ERROR_CODES.RESET_TOKEN_NOT_FOUND]: 'Invalid or already used password reset token.', // Added missing message mapping
  [ERROR_CODES.RESET_TOKEN_EXPIRED]:
    'Your reset token has expired. Please request a new code.',

  [SUCCESS_CODES.JWT]: 'Session token generated successfully.',
  [SUCCESS_CODES.REFRESH_TOKEN]: 'Your token generated successfully.',
  [ERROR_CODES.JWT_EXPIRED]: 'Your jwt has expired',
  [ERROR_CODES.JWT_INVALID]: 'Your session is invalid. Please log in again.',
  [ERROR_CODES.REFRESH_TOKEN_INVALID]:
    'Your refresh token is invalid. Please log in again.',
  [ERROR_CODES.REFRESH_TOKEN_FAILED]: 'Failed to refresh session. Please log in again.',
  [ERROR_CODES.SESSION_INVALID]: 'Your active session is invalid.',
  [ERROR_CODES.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',

  // --- Logout Responses ---
  [SUCCESS_CODES.LOGOUT]: 'Logged out successfully. We hope to see you back soon!',
  [ERROR_CODES.LOGOUT_FAILED]: 'Logout operation failed. Please try again.',

  // --- Rate Limiting Responses ---
  [ERROR_CODES.RATELIMIT_GLOBAL]:
    'Too many requests. Please slow down and try again later.',
  [ERROR_CODES.RATELIMIT_LOGIN]:
    'Too many login attempts. Access temporarily locked for security. Please try again later.',
  [ERROR_CODES.RATELIMIT_REGISTER]:
    'Registration limit exceeded. Please try again later.',
  [ERROR_CODES.RATELIMIT_EMAIL]:
    'Action blocked. Please wait before requesting another verification email.',
};

export default RESPONSE_MESSAGES;
