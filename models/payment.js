import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String, // Assuming your user model uses UUIDv4 to create user IDs
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  transactionId: {
    type: String,
    default: "", // Default to an empty string
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  remark: {
    type: String,
    default: "Processing Payment",
  },
  paymentType: {
    type: String,
    enum: ["recharge", "withdraw"],
    required: true,
  },
  bankDetails: {
    accountNumber: {
      type: String,
      default: "", // Default to an empty string
    },
    ifscCode: {
      type: String,
      default: "", // Default to an empty string
    },
    upiDetails: {
      type: String,
      default: "",
    },
    recipientName: {
      // Add recipientName field
      type: String,
      default: "", // Default to an empty string
    },
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
