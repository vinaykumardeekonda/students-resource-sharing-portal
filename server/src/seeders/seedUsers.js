import mongoose from 'mongoose';
import User from '../models/userModel.js'; // ✅ Ensure it points to userModel.js, not User.js
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [];

for (let i = 1; i <= 30; i++) {
  users.push({
    name: `Test User ${i}`,
    email: `testuser${i}@example.com`,
    password: 'password123', // 🔐 no hashing here, for simplicity
    role: i === 1 ? 'admin' : 'user',
    alias: `anon${i.toString().padStart(3, '0')}`,
  });
}

await User.deleteMany();
await User.insertMany(users);

console.log('✅ Seeded 30 users successfully!');
process.exit();
