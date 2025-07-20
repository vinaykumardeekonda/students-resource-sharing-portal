// src/controllers/activityLogController.js

import ActivityLog from "../models/ActivityLog.js";

// Get all logs — for admin
export const getAllLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("performedBy", "email role");

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
};

// Get my logs — for current user
export const getMyLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await ActivityLog.find({ performedBy: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("targetResource", "title");

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your logs", error });
  }
};
