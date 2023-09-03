const nodemailer = require("nodemailer");
require("dotenv").config();

const host = process.env.EMAIL_HOST;
const user = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;

const emailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: host,
      auth: {
        user: user,
        pass: password,
      },
      secure: true, // Use secure connection (TLS/SSL)
    });

    const mailOptions = {
      from: "SmartLearn || SmartLearn Team",
      to: `${email}`,
      html: `${body}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.response}`);
    return info;

  } catch (err) {
    console.error(`Error sending email to ${email}: ${err.message}`);
    throw err; // Re-throw the error for higher-level error handling
  }
};

module.exports = emailSender;
