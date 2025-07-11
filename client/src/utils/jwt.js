import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import User model

// We need to query the user to check if they have a password
const generateToken = async (id) => {
  const user = await User.findById(id).select('+password');
  
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    // Add a boolean to the token payload indicating if a password is set
    hasPassword: !!user.password, 
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default generateToken;