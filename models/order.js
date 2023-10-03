import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
  game: {
    type: String, // color prediction game or quiz game
    required: true,
  },
  select: {
    type: String, // option selected
    required: true,
  },
  betamount: {
    type: Number,
    required: true,
  },
  results: {
    type: [String], // Store multiple results as an array of strings
    required: true,
  },
  profitLoss: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
