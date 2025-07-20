import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadResource,
  getResourcesByUser,
  getAllApprovedResources,
} from '../controllers/resourceController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Upload multiple files
router.post('/upload', protect, upload.array('files', 10), uploadResource);

// (Optional upcoming routes)
router.get('/my-uploads', protect, getResourcesByUser);
router.get('/approved', getAllApprovedResources);

export default router;
