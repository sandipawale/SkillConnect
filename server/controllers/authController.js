import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/email.js'; // <-- IMPORT THE EMAIL UTILITY

export const registerUser = asyncHandler(async (req, res) => 
  {
  const { name, email, password } = req.body;
  console.log(password);
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });

  if (user) {
    // --- THIS IS THE NEW EMAIL LOGIC ---
    try {
      const welcomeMessage = `<h1>Welcome to Learnify, ${user.name}!</h1><p>We're excited to have you on board. Start your learning journey today!</p>`;
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Learnify!',
        html: welcomeMessage,
      });
      console.log('Welcome email sent successfully.'.green);
    } catch (err) {
      console.error(`Email could not be sent: ${err}`.red);
      // We don't throw an error here, as the user registration was successful.
      // Email failure should not prevent the user from being created.
    }
    // --- END OF NEW EMAIL LOGIC ---

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: await generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: await generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});