import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    // --- THIS IS THE CRITICAL FIX ---
    password: {
      type: String,
      // The password is now only required if there is no googleId
      required: function() { return !this.googleId && !this.facebookId; },
      minlength: 6,
      select: false,
    },
    // --- END OF FIX ---
    role: {
      type: String,
      enum: ['user', 'instructor', 'admin'],
      default: 'user',
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving the user
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified AND it exists
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);