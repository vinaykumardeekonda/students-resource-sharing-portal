import express from "express";
import {
  getPendingResources,
  updateResourceStatus,
  deleteResource,
  getLogs,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply admin-only protection to all routes
router.use(protect, adminOnly);

// Get all pending resources
router.get("/resources/pending", getPendingResources);

// Approve or reject a resource
router.put("/resources/:resourceId/status", updateResourceStatus);

// Delete a resource
router.delete("/resources/:resourceId", deleteResource);

// Get logs
router.get("/logs", getLogs);

export default router;
