import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = async (id) => {
  const user = await User.findById(id).select('+password');
  
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    // Add timestamps to the token
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default generateToken;