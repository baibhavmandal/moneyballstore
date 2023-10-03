import express from "express";
import jwtMiddleware from "../middlewares/jwtMiddleware.js";
import {
  getAllUserInfo,
  getUserMobileNumber,
  getUserTotalBets,
  getUserBalance,
  getUserPayments,
  getUserOrders,
  getUserTopOrders,
  getUserInvites,
} from "../controllers/userController.js";

const router = express.Router();

// Apply JWT middleware to secure these routes
router.use(jwtMiddleware);

// GET /api/user/all - Get all user information
router.post("/all", getAllUserInfo);

// GET /api/user/mobilenumber - Get user's total bets
router.post("/mobilenumber", getUserMobileNumber);

// GET /api/user/totalbets - Get user's total bets
router.post("/totalbets", getUserTotalBets);

// GET /api/user/balance - Get user's balance
router.post("/balance", getUserBalance);

// GET /api/user/payments - Get user's payments
router.post("/payments", getUserPayments);

// GET /api/user/orders - Get user's orders
router.post("/orders", getUserOrders);

// GET /api/user/orders - Get user's orders
router.post("/toporders", getUserTopOrders);

// GET /api/user/invites - Get user's invites
router.post("/invites", getUserInvites);

export default router;
