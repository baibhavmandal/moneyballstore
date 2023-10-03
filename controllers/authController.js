import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

import { findUserByNumber, updateUserPassword } from "../modules/dbModule.js";
import User from "../models/user.js";
import { deleteOtpFromStore, getOtpFromStore } from "../config/data.js";

// Function to generate JWT token
function generateJwtToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Controller for user login
const loginUser = async (req, res) => {
  try {
    const { mobilenumber, password } = req.body;

    const user = await findUserByNumber(mobilenumber);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateJwtToken(user.userId);

    res.json({
      message: "Login successful",
      token,
      userId: user.userId,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// Controller for user registration
const registerUser = async (req, res) => {
  try {
    const { mobilenumber, password, otp } = req.body;

    if (await findUserByNumber(mobilenumber)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const storedOtp = getOtpFromStore(mobilenumber);
    if (!storedOtp || otp !== storedOtp.toString()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const salt = await bcrypt.genSalt(4);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = uuidv4();

    const newUser = new User({
      userId,
      mobileNumber: mobilenumber,
      password: hashedPassword,
    });

    await newUser.save();
    deleteOtpFromStore(mobilenumber);

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

// Controller for resetting the password after receiving OTP
const resetPassword = async (req, res) => {
  try {
    const { mobilenumber, otp, newPassword } = req.body;

    if (await findUserByNumber(mobilenumber)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const storedOtp = getOtpFromStore(mobilenumber);
    if (!storedOtp || otp !== storedOtp.toString()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const salt = await bcrypt.genSalt(4);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await updateUserPassword(mobilenumber, hashedPassword);
    console.log(updatedUser);

    deleteOtpFromStore(mobilenumber);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export { loginUser, registerUser, resetPassword };
