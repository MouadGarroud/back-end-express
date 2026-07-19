const activationTemplate = ({ username, activationLink }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activate Your Account</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 30px; text-align: center; background-color: #4a90e2; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px;">Welcome, ${username}!</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
          <p>Thank you for signing up. Please activate your account by clicking the button below:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" style="background-color: #4a90e2; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; display: inline-block; font-weight: bold;">Activate Account</a>
          </p>
          <p>This activation link will expire in <strong>24 hours</strong>. If you did not sign up, please ignore this email.</p>
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

export default activationTemplate;
