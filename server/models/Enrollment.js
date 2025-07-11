import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: true,
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    // Progress is tracked as an array of lesson statuses
    progress: [
      {
        lessonId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Lesson',
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

EnrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

export default mongoose.model('Enrollment', EnrollmentSchema);