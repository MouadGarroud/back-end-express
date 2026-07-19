import nodemailer from 'nodemailer';
import mailConfig from '../../config/mail.config.js';

import activationTemplate from './templates/activation.service.js';
import resetTemplate from './templates/reset.service.js';

import TYPE_MAIL from '../../constants/typesMail.constant.js';
import MAIL_SUBJECTS from '../../constants/mailSubjects.constant.js';
import ERROR_CODES from '../../constants/errorCodes.constant.js';
import RESPONSE_MESSAGES from '../../constants/responseMessages.constant.js';

export const sendTypedMail = async ({ type, to, payload }) => {
  const template = {
    [TYPE_MAIL.ACTIVATION]: {
      subject: MAIL_SUBJECTS.ACTIVATION,
      render: activationTemplate,
    },
    [TYPE_MAIL.RESET]: {
      subject: MAIL_SUBJECTS.RESET,
      render: resetTemplate,
    },
  }[type];

  if (!template) {
    throw new Error(
      RESPONSE_MESSAGES[ERROR_CODES.BAD_REQUEST],
      400,
      ERROR_CODES.MAIL_TYPE_NOT_ALLOWED,
    );
  }

  console.log('📨 Sending mail to:', to);

  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: mailConfig.auth,
  });

  const htmlContent = template.render(payload);

  try {
    const info = await transporter.sendMail({
      from: mailConfig.from,
      to,
      subject: template.subject,
      html: htmlContent,
    });

    return info;
  } catch (err) {
    throw err;
  }
};
