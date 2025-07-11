import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson',
    required: true,
    unique: true, // A lesson can only have one assignment
  },
  title: {
    type: String,
    required: [true, 'Please add an assignment title'],
    trim: true,
  },
  instructions: {
    type: String, // Can be markdown or plain text
    required: [true, 'Please provide instructions'],
  },
  dueDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Assignment', AssignmentSchema);