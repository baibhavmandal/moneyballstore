import mongoose from "mongoose";

// Define the schema
const DataSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
    default: 0,
  },
  y: {
    type: Number,
    required: true,
    default: 0,
  },
  z: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Create a model based on the schema
const DataModel = mongoose.model("Data", DataSchema);

export default DataModel;
