import { findUserByUserId } from "../modules/dbModule.js";
import Payment from "../models/payment.js";
import Admin from "../models/admin.js";

// Payment controller function to create a new payment
async function createRecharge(req, res) {
  try {
    // Assuming you receive the user ID, transaction ID, and date in the request body
    const { userId, amount, transactionId } = req.body;

    // Use findUserByUserId to check if the user exists
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new payment with default amount and approval status
    const payment = new Payment({
      userId,
      amount,
      transactionId,
      paymentDate: new Date(),
      paymentType: "recharge",
    });

    // Save the new payment record
    await payment.save();

    // Push the payment's _id to the user's payments array
    user.payments.push(payment._id); // Add the payment's ObjectId to the user's payments array
    await user.save();

    // Find all admin documents
    const admins = await Admin.find();

    // Loop through all admin documents and add the payment details to currentPayments
    for (const admin of admins) {
      admin.currentPayments.push(payment._id);
      await admin.save();
    }

    res.json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createWithdraw(req, res) {
  try {
    // Assuming you receive the user ID, withdrawal amount, and date in the request body
    const { userId, withdrawalAmount, bankDetails } = req.body;

    // Use findUserByUserId to check if the user exists
    const user = await findUserByUserId(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new payment with withdrawal details
    const payment = new Payment({
      userId,
      amount: withdrawalAmount,
      paymentDate: new Date(),
      paymentType: "withdraw",
      bankDetails: {
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        upiDetails: bankDetails.upiDetails,
        recipientName: bankDetails.recipientName,
      },
    });

    // Save the new payment record
    await payment.save();

    // Push the payment's _id to the user's payments array
    user.payments.push(payment._id); // Add the payment's ObjectId to the user's payments array
    await user.save();

    // Find all admin documents
    const admins = await Admin.find();

    // Loop through all admin documents and add the payment details to currentPayments
    for (const admin of admins) {
      admin.currentPayments.push(payment._id);
      await admin.save();
    }

    res.json({ message: "Withdrawal created successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { createRecharge, createWithdraw };
