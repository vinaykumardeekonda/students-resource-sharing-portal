// src/controllers/studentController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Student } from '../models/Student.js'; // ✅ named import

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// @desc    Register new student
// @route   POST /api/student/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Student already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Login student
// @route   POST /api/student/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: student._id, email: student.email, role: student.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
