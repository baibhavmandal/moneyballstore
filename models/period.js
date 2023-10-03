import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 200000000,
  },
});

const Period = mongoose.model("Period", periodSchema);

export default Period;
