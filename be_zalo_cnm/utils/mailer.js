import nodemailer from 'nodemailer';

const adminEmail = 'hoanghuytoi03@gmail.com';
// Thay thế bằng App Password được tạo từ Google Account
const adminPassword = 'ubfgbzoaduvlnomd'; // Cần thay bằng App Password thực
const mailHost = 'smtp.gmail.com';
const mailPort = 587;

export const mailer = (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // false cho port 587, true cho port 465
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  });
  const options = {
    from: adminEmail, 
    to: to, 
    subject: subject, 
    html: htmlContent 
  };
  return transporter.sendMail(options);
};
