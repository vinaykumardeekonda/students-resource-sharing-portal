import dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables first

import express from 'express';
import './config/cloudinary.js'; // This now has access to env vars
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import rateLimiter from './middleware/rateLimiter.js';
import activityLogRoutes from './routes/activityLogRoutes.js';

const app = express();

connectDB();
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/resources', resourceRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
