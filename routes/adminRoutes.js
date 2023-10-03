import express from "express";
import {
  adminLogin,
  getAllCurrentOrders,
  getRechargeOrders,
  getWithdrawOrders,
  verifyRecharge,
  verifyWithdrawal,
} from "../controllers/adminController.js";
import { verifyAdminToken } from "../middlewares/jwtAdminMiddleware.js";
import { sendOTPToAdmin } from "../controllers/sendOTPController.js";

const router = express.Router();

// POST /api/v1/admin
router.post("/adminLogin", adminLogin);

// POST /api/v1/admin
router.post("/sendOTPToAdmin", sendOTPToAdmin);

// POST /api/v1/admin
router.post("/getAllCurrentOrders", verifyAdminToken, getAllCurrentOrders);

// POST /api/v1/admin
router.post("/getRechargeOrders", verifyAdminToken, getRechargeOrders);

// POST /api/v1/admin
router.post("/getWithdrawOrders", verifyAdminToken, getWithdrawOrders);

// POST /api/v1/admin
router.post("/verifyPayment", verifyAdminToken, verifyRecharge);

// POST /api/v1/admin
router.post("/verifyWithdrwal", verifyAdminToken, verifyWithdrawal);

export default router;
