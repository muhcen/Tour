const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  console.log(option);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL__PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOption = {
    from: "mohsen moradi <mohsenuok@gmail.com>",
    to: option.to,
    subject: option.subject,
    text: option.text,
  };
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
