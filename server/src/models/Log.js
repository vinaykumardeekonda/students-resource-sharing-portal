import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: String,
  userId: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Log = mongoose.model("Log", logSchema);

