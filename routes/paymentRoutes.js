import express from "express";
import jwtMiddleware from "../middlewares/jwtMiddleware.js";
import {
  createRecharge,
  createWithdraw,
} from "../controllers/paymentController.js";

const router = express.Router();

router.use(jwtMiddleware);

// POST /api/v1/payment - User Payment
router.post("/createRecharg", createRecharge);
router.post("/createWithdraw", createWithdraw);

export default router;
