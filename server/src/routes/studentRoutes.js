import express from 'express';
import { register, login } from '../controllers/studentController.js'; // ✅ Named imports

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router; // ✅ ES export
