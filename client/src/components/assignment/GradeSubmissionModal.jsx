import { useState, useEffect } from 'react';
import { useGradeSubmissionMutation } from '../../services/assignmentService';
import { toast } from 'react-hot-toast';

const GradeSubmissionModal = ({ submission, onClose }) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const [gradeSubmission, { isLoading }] = useGradeSubmissionMutation();
  useEffect(() => {
    if (submission) {
      setGrade(submission.grade || '');
      setFeedback(submission.feedback || '');
    }
  }, [submission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await gradeSubmission({
        submissionId: submission._id,
        data: { grade: Number(grade), feedback }
      }).unwrap();
      toast.success('Submission graded successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to grade submission.');
    }
  };

  if (!submission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold p-6 border-b flex-shrink-0">
          Grade Submission from: {submission.student.name}
        </h2>
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Student's Work:</h3>
            <div className="bg-gray-100 p-4 rounded-md border whitespace-pre-wrap">
              {submission.submissionContent}
            </div>
          </div>
          <form id="grade-form" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="grade" className="block text-gray-700 font-bold mb-2">Grade (out of 100)</label>
              <input
                type="number"
                id="grade"
                name="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                min="0"
                max="100"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="feedback" className="block text-gray-700 font-bold mb-2">Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="5"
                className="w-full px-3 py-2 border rounded"
                placeholder="Provide constructive feedback..."
              ></textarea>
            </div>
          </form>
        </div>
        <div className="flex justify-end space-x-4 p-6 border-t mt-auto flex-shrink-0">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          <button type="submit" form="grade-form" disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400">
            {isLoading ? 'Saving...' : 'Submit Grade'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;