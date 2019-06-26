const nodemailer = require('nodemailer');

module.exports = transporter = nodemailer.createTransport({
  service: 'Mail.Ru',
  auth: {
    user: 'juliasnoww@mail.ru',
    pass: '1997zjqxbr'
  }
});
