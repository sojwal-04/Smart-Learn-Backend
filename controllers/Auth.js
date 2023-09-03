const User = require("../models/User.js");
const OTP = require("../models/OTP.js");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

//Send OTP

exports.sendOTP = async (req, res) => {
  try {
    //Fetch email from request's body
    const { email } = req.body;

    //Check if user exists
    const existingUser = await User.findOne({ email: email });

    //If User already exists
    if (existingUser) {
      // 409 Conflict, which is used to indicate that the request conflicts with the current state of the target resource (in this case, the conflict arises from attempting to create a user with an email that already exists).
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    //Generate OTP

    const otpLength = 6;
    let otp;
    let existingOTP;
    do {
      otp = otpGenerator.generate(otpLength, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      existingOTP = await OTP.findOne({ otp: otp });
    } while (existingOTP);

    //Make entry of otp in db
    const otpPayload = { email: email, otp: otp };

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (err) {
    console.log("Error occurred while sending OTP. Error: ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Sign Up

exports.signUp = async (req, res) => {
  try {
    //Fetch data from the request's body

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //Validate it
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //Check if two passwords are the same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match. Please try again",
      });
    }

    // Check if use exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: true,
        message: "User already exists",
      });
    }

    //find Most recent otp stored for the user
    const recentOTP = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    //Validate
    if (!recentOTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP found",
      });
    } else if (recentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Before inserting into db table, we need to create Profile object

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    //Insert into DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: `User created successfully`,
      user,
    });
  } catch (err) {
    console.log("Error occurred while signing up. Error: ", err);
    return res.status(500).json({
      success: false,
      message: "User cannot be created. Try Again",
    });
  }
};

//Login

//Change Password
