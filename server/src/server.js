import express from 'express';
import dotenv from 'dotenv';
import './config/cloudinary.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import rateLimiter from './middleware/rateLimiter.js';
import activityLogRoutes from './routes/activityLogRoutes.js';

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/resources', resourceRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/activity-logs', activityLogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
