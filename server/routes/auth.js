import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import generateToken from '../utils/jwt.js';
import { registerValidationRules, validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', registerValidationRules(), validate, registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// --- THIS IS THE FIX ---
// We now use passport.authenticate as a middleware to pass state
router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'], state: JSON.stringify({ action: 'login' }) }));
router.get('/google/register', passport.authenticate('google', { scope: ['profile', 'email'], state: JSON.stringify({ action: 'register' }) }));
// --- END OF FIX ---

router.get(
  '/google/callback',
  (req, res, next) => {
    const state = JSON.parse(req.query.state);
    const failureRedirect = process.env.NODE_ENV === 'production' 
      ? `${process.env.FRONTEND_URL}/${state.action === 'login' ? 'login' : 'register'}` 
      : `http://localhost:5173/${state.action === 'login' ? 'login' : 'register'}`;
      
    passport.authenticate('google', { failureRedirect, session: false }, (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        // If passport returns 'false', it means login failed (user not found).
        // Redirect with an error message.
        return res.redirect(`${failureRedirect}?error=${encodeURIComponent(info.message)}`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    const token = await generateToken(req.user.id);
    const redirectURL = process.env.NODE_ENV === 'production'
      ? `${process.env.FRONTEND_URL}/auth/callback?token=${token}`
      : `http://localhost:5173/auth/callback?token=${token}`;
    res.redirect(redirectURL);
  }
);

export default router;