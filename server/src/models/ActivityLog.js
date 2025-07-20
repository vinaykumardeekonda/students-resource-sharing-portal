// src/models/ActivityLog.js
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    details: String,
    targetResource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
