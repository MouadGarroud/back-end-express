export const resetTemplate = ({ username, rawToken }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 30px; text-align: center; background-color: #4a90e2; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
          <p>Hello ${username},</p>
          <p>We received a request to reset your password. Use the verification code below to proceed:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="
              display: inline-block;
              background-color: #f4f4f7;
              border: 2px dashed #4a90e2;
              color: #333333;
              font-size: 26px;
              font-weight: bold;
              letter-spacing: 6px;
              padding: 15px 40px;
              border-radius: 8px;
            ">
              ${rawToken}
            </div>
          </div>

          <p>This code will expire in <strong>10 minutes</strong> for security reasons. If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Cheers,<br/>The Team</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa; background-color: #f4f4f7;">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export default resetTemplate;
