// authRoutes.js
import express from "express";
import {
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/authController.js";
import { sendOTPToClient } from "../controllers/sendOTPController.js";

const router = express.Router();

// POST /api/register - User registration
router.post("/register", registerUser);

// POST /api/login - User login
router.post("/login", loginUser);

// POST /api/send-otp - User send otp
router.post("/send-otp", sendOTPToClient);

// POST /api/reset-password
router.post("/reset-password", resetPassword);

export default router;
