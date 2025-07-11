import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a lesson title'],
    },
    content: {
      type: String,
      required: [true, 'Please add lesson content'],
    },
    videoUrl: {
      type: String,
    },
    pdfUrl: {
      type: String, 
    },
    // --- NEW FIELD FOR SLIDESHOW ---
    slides: [
      {
        type: String, // Array of image URLs
      },
    ],
    duration: {
      type: Number,
      required: [true, 'Please add the lesson duration'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Lesson', LessonSchema);