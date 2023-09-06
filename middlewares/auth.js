const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.js");

const secretKey = process.env.JWT_SECRET_KEY;

//Auth
exports.auth = async (req, res, next) => {
  try {
    //Extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      //403 - forbidden
      return res.status(403).json({
        success: false,
        message: "Token is missing",
      });
    }

    //Verify the token
    try {
      const decode = await jwt.verify(token, secretKey);
      console.log(decode);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for student only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructor only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isAdmin

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
