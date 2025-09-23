// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import User from '../models/User.js';

// const googleCallbackURL = process.env.NODE_ENV === 'production'
//   ? `${process.env.BACKEND_URL}/api/auth/google/callback`
//   : '/api/auth/google/callback';

// export default function(passport) {
//   passport.use(
//     new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: googleCallbackURL,
//         passReqToCallback: true,
//       },
//       async (req, accessToken, refreshToken, profile, done) => {
//         try {
//           const state = JSON.parse(req.query.state);
//           const email = profile.emails[0].value;

//           // --- THIS IS THE GUARANTEED FIX ---
//           let user = await User.findOne({ email: email });

//           if (user) {
//             // User with this email already exists.
//             if (state.action === 'register') {
//               // If they are on the register page, this is an error.
//               return done(null, false, { message: 'This email is already registered. Please log in.' });
//             }
//             // If they are on the login page, link their Google ID if it doesn't exist.
//             if (!user.googleId) {
//               user.googleId = profile.id;
//               await user.save();
//             }
//             return done(null, user);
//           } else {
//             // User does not exist.
//             if (state.action === 'register') {
//               // If they are on the register page, create a new account.
//               const newUser = await User.create({
//                 googleId: profile.id,
//                 name: profile.displayName,
//                 email: email,
//               });
//               return done(null, newUser);
//             } else {
//               // If they are on the login page, this is an error.
//               return done(null, false, { message: 'This email is not registered. Please sign up first.' });
//             }
//           }
//           // --- END OF GUARANTEED FIX ---
//         } catch (err) {
//           return done(err, null);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   });
// }

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const googleCallbackURL =
  process.env.NODE_ENV === 'production'
    ? `${process.env.BACKEND_URL}/api/auth/google/callback`
    : 'http://localhost:5000/api/auth/google/callback';

export default function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackURL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Safe parse state
          let state = { action: 'login' };
          if (req.query.state) {
            try { state = JSON.parse(req.query.state); } catch {}
          }

          if (!profile.emails || !profile.emails.length) {
            return done(null, false, { message: 'No email associated with this Google account.' });
          }

          const email = profile.emails[0].value;
          let user = await User.findOne({ email });

          if (user) {
            // User exists
            if (state.action === 'register') {
              return done(null, false, { message: 'This email is already registered. Please log in.' });
            }
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          } else {
            // User does not exist
            if (state.action === 'register') {
              const newUser = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email,
              });
              return done(null, newUser);
            } else {
              return done(null, false, { message: 'This email is not registered. Please sign up first.' });
            }
          }
        } catch (err) {
          console.error('Google Strategy Error:', err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
