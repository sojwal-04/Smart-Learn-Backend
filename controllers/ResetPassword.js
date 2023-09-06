const User = require("../models/User");
const emailSender = require("../utils/emailSender");
const bcrypt = require("bcrypt");

//Reset Password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //Get email
    const { email } = req.body;

    //If user exists for thsi email ?
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist for this email",
      });
    }

    //Generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedUserDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordToken: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    //Link of frontend
    const url = `http://localhost:2173/update-password/${token}`;

    //send mail containring url
    await emailSender(
      email,
      "Password Reset Link",
      `Password reset link : ${url}`
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully, check your email",
      updatedUserDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: "Erro while sending email, try again later",
    });
  }
};

//Reset Password

exports.resetPassword = async (req, res) => {
  try {
    // fetch details, token
    const { password, confirmPassword, token } = req.body;

    //Validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    //Get user details
    const existingUser = await User.findOne({ token: token });

    // If no entry in db - INVALID TOKEN
    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "Token is invalid",
      });
    }

    //Time expired of token
    if (existingUser.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token expires",
      });
    }

    //hashed the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
    });
  }
};
