import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCreateOrUpdateAssignmentMutation } from '../../services/assignmentService';

const ManageAssignmentModal = ({ lesson, assignment, onClose }) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [createOrUpdateAssignment, { isLoading }] = useCreateOrUpdateAssignmentMutation();

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || '');
      setInstructions(assignment.instructions || '');
    }
  }, [assignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrUpdateAssignment({
        lessonId: lesson._id,
        title,
        instructions,
      }).unwrap();
      toast.success(assignment ? 'Assignment updated!' : 'Assignment created!');
      onClose();
    } catch (err) {
      toast.error('Failed to save assignment.');
    }
  };

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {assignment ? 'Edit Assignment' : 'Create Assignment'} for "{lesson.title}"
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="assignment-title" className="block text-gray-700 font-bold mb-2">Assignment Title</label>
            <input
              type="text"
              id="assignment-title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="assignment-instructions" className="block text-gray-700 font-bold mb-2">Instructions</label>
            <textarea
              id="assignment-instructions"
              name="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              rows="6"
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">
              {isLoading ? 'Saving...' : 'Save Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAssignmentModal;