import mongoose from 'mongoose';

const AssignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  // The submission can be simple text or a file upload
  submissionContent: {
    type: String,
  },
  submissionFileUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Graded'],
    default: 'Submitted',
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
  },
  feedback: { // Feedback from the instructor
    type: String,
  },
}, {
  timestamps: true,
});

// A student can only submit to an assignment once
AssignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);