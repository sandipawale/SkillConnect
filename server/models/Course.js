import mongoose from 'mongoose';
import slugify from 'slugify';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
  },
  duration: {
    type: Number,
    required: [true, 'Please add a course duration'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    default: 0,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  thumbnail: {
    type: String,
    default: 'no-photo.jpg',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  // --- NEW FIELD ---
  tags: {
    type: [String], // An array of strings
  },
  // --- END OF NEW FIELD ---
}, {
  timestamps: true,
});

CourseSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

export default mongoose.model('Course', CourseSchema);