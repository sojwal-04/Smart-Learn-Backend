const mongoose = require("mongoose");
const emailSender = require("../utils/emailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
    minlength: 6, // Minimum OTP length
    maxlength: 6, // Maximum OTP length
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

//A function to send email for verification

async function sendVerificationEmail(email, otp) {
  try {
    let emailBody = `Hello,

    You are receiving this email from SmartLearn to verify your account. Please use the following one-time password (OTP) to complete the verification process (valid for next 5 minutes):

    OTP: ${otp}

    If you didn't request this email, please ignore it.

    Best regards,
    The SmartLearn Team`;

    const emailResponse = await emailSender(email, emailBody, otp);
    console.log("Email sent successfully. ", emailResponse);
  } catch (err) {
    console.log(`Error while sending email to ${email} :: ${err} `);
    throw err;
  }
}

// Middleware to send verification email when OTP is modified
OTPSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("otp")) {
      return next();
    }
    const email = this.email;
    const otp = this.otp;
    await sendVerificationEmail(email, otp);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("OTP", OTPSchema);
