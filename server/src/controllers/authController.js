import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    const alias = Math.random().toString(36).slice(2, 10) + '@' + Math.random().toString(36).slice(2, 6);
    const user = await User.create({ name, email, password: hashed, alias });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, alias: user.alias } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, alias: user.alias, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};