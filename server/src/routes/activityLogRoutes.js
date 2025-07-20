import express from 'express';
import { getAllLogs, getMyLogs } from '../controllers/activityLogController.js';
import verifyToken from '../middleware/verifyToken.js';
import checkAdmin from '../middleware/checkAdmin.js'; // if needed

const router = express.Router();

// Admin-only: Get all logs
router.get('/all', verifyToken, checkAdmin, getAllLogs);

// Logged-in user: Get my own logs
router.get('/my', verifyToken, getMyLogs);

export default router;
