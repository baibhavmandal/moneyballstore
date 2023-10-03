import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import Admin from "../models/admin.js";
import Payment from "../models/payment.js";
import { findUserByUserId } from "../modules/dbModule.js";
import { deleteAdminOTP, getAdminOTP } from "../config/data.js";

// Admin Login code
async function adminLogin(req, res) {
  try {
    const { mobilenumber, password, otp } = req.body;

    console.log(mobilenumber, password, otp);

    const admin = await Admin.findOne({
      $or: [{ mobileNumber: mobilenumber }],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify OTP
    const storedOtp = getAdminOTP(mobilenumber);
    if (!storedOtp || otp !== storedOtp.toString()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    deleteAdminOTP(mobilenumber);

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If mobile number, OTP, and password are all verified
    // Create a JWT token and send it to the client
    const payload = {
      adminId: admin._id,
      mobileNumber: admin.mobileNumber,
    };

    const token = jwt.sign(payload, "your-secret-key", { expiresIn: "1h" }); // Change 'your-secret-key' to your actual secret key

    res.json({ message: "Login successful", token: token, adminId: admin._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Get list of all unapproved orders
async function getAllCurrentOrders(req, res) {
  try {
    // Find the admin by adminId (assuming it's attached to the request object by the JWT middleware)
    const adminId = req.adminId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Retrieve the currentOrders array from the admin document
    const currentOrders = admin.currentOrders;

    // Send the list of current orders as a response
    res.json({ currentOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// List of all recharge orders that are not approved
async function getRechargeOrders(req, res) {
  try {
    // Find the admin by adminId (assuming it's attached to the request object by the JWT middleware)
    const adminId = req.adminId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Retrieve the currentOrders array from the admin document with paymentType "Recharge"
    const rechargeOrders = admin.currentOrders.filter(
      (order) => order.paymentType === "Recharge"
    );

    // Send the list of recharge orders as a response
    res.json({ rechargeOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// List of all Withdraw orders that are not approved.
async function getWithdrawOrders(req, res) {
  try {
    // Find the admin by adminId (assuming it's attached to the request object by the JWT middleware)
    const adminId = req.adminId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Retrieve the currentOrders array from the admin document with paymentType "Withdraw"
    const withdrawOrders = admin.currentOrders.filter(
      (order) => order.paymentType === "Withdraw"
    );

    // Send the list of withdrawal orders as a response
    res.json({ withdrawOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Admin controller function to verify payments
async function verifyRecharge(req, res) {
  try {
    const { approved, paymentDetails, amount, remark } = req.body;

    // Find the admin by adminId
    const adminId = req.adminId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find the payment by its unique identifier
    const payment = await Payment.findById(paymentDetails._id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if the payment is already verified
    if (payment.isApproved) {
      return res.status(400).json({ message: "Payment is already approved" });
    }

    // Update the payment's approval status and remarks
    payment.isApproved = approved;
    payment.remark = approved
      ? "Verified by the admin"
      : remark || "Payment not approved";

    // If the payment is approved and the amount is not empty, update the amount
    if (approved && amount !== undefined) {
      payment.amount = amount;
    }

    // If the payment is approved, update the user's balance
    if (approved && amount !== undefined && amount > 0) {
      // Find the user by user ID (assuming it's attached to the payment)
      const user = await findUserByUserId(paymentDetails.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user balance
      user.balance += amount;

      // Save the updated user document
      await user.save();
    }

    // Save the updated payment document
    await payment.save();

    // Send a response indicating success
    res.json({ message: "Payment verification successful", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Admin controller function to verify withdrawal payments
async function verifyWithdrawal(req, res) {
  try {
    // Assuming you receive the payment details and approval status in the request body
    const { approved, paymentDetails, remark } = req.body;

    // Find the admin by adminId (assuming it's attached to the request object by the JWT middleware)
    const adminId = req.adminId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find the payment by its unique identifier (e.g., transaction ID)
    const payment = await Payment.findById(paymentDetails._id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if the payment is already verified
    if (payment.isApproved) {
      return res.status(400).json({ message: "Payment is already approved" });
    }

    // Update the payment's approval status and remarks
    payment.isApproved = approved;
    payment.remark = approved
      ? "Approved" // Default remark for approval
      : remark || "Payment not approved"; // Use provided remark or default

    // If the payment is approved, update the user's balance
    if (approved) {
      // Find the user by user ID (assuming it's attached to the payment)
      const user = await findUserByUserId(paymentDetails.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user balance
      user.balance -= paymentDetails.amount;

      // Save the updated user document
      await user.save();
    }

    // Save the updated payment document
    await payment.save();

    // Send a response indicating success
    res.json({ message: "Payment verification successful", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  adminLogin,
  getAllCurrentOrders,
  getRechargeOrders,
  getWithdrawOrders,
  verifyRecharge,
  verifyWithdrawal,
};
