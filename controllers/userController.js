import User from "../models/user.js";
import { findUserByUserId } from "../modules/dbModule.js";
import Order from "../models/order.js";
import Payment from "../models/payment.js";

// Get all user information excluding sensitive fields
const getAllUserInfo = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const { userId } = req.body;
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Exclude sensitive fields (password and mobileNumber) from the user object
    const { password, ...userInfo } = user.toObject();

    // Return user information without sensitive fields
    res.json(userInfo);
  } catch (error) {
    console.error("Error fetching user information:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's mobile number
const getUserMobileNumber = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const { userId } = req.body;
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user's total bets
    res.json({ mobileNumber: user.mobileNumber });
  } catch (error) {
    console.error("Error fetching user's total bets:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's total bets
const getUserTotalBets = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const { userId } = req.body;
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user's total bets
    res.json({ totalBets: user.totalBets });
  } catch (error) {
    console.error("Error fetching user's total bets:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's balance
const getUserBalance = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user's balance
    res.json({ balance: user.balance });
  } catch (error) {
    console.error("Error fetching user's balance:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's payments
const getUserPayments = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const { userId } = req.body;
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch payment details for the user
    const payments = await Payment.find({ userId: req.userId });

    // Return user's payments
    res.json({ payments });
  } catch (error) {
    console.error("Error fetching user's payments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const { userId } = req.body;
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch order details for the user
    const orders = await Order.find({ userId: user.userId });

    // Return user's orders
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching user's orders:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get top 10 user's orders
const getUserTopOrders = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const { userId } = req.body;
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the top 20 orders by date for the user
    const orders = await Order.find({ userId: user.userId })
      .sort({ date: -1 }) // Sort orders by date in descending order
      .limit(20); // Limit the result to the top 20 orders

    // Return user's top orders
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching user's top orders:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's invites
const getUserInvites = async (req, res) => {
  try {
    // Fetch user data based on user ID from the request (assuming it's in req.userId)
    const { userId } = req.body;
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user's invites (assuming you have an invites field in the user model)
    res.json({ invites: user.invites });
  } catch (error) {
    console.error("Error fetching user's invites:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getAllUserInfo,
  getUserMobileNumber,
  getUserTotalBets,
  getUserBalance,
  getUserPayments,
  getUserOrders,
  getUserTopOrders,
  getUserInvites,
};
