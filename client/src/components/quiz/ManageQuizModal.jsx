import { useState, useEffect } from 'react';
import { useGetQuizByIdForInstructorQuery, useAddQuestionMutation, useUpdateQuestionMutation, useDeleteQuestionMutation } from '../../services/quizService';
import { toast } from 'react-hot-toast';
import Loader from '../common/Loader';

const ManageQuizModal = ({ quizId, onClose }) => {
  const { data: quizData, isLoading, refetch } = useGetQuizByIdForInstructorQuery(quizId);
  const [addQuestion] = useAddQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (quizData) {
      setQuestions(quizData.data.questions);
    }
  }, [quizData]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }], _id: `new-${Date.now()}` }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.forEach((opt, i) => opt.isCorrect = i === oIndex);
    setQuestions(updatedQuestions);
  };

  const handleSaveQuestion = async (question) => {
    const { text, options } = question;
    if (!text || options.some(opt => !opt.text)) {
      return toast.error('Please fill all fields for the question.');
    }
    try {
      if (question._id.startsWith('new-')) {
        await addQuestion({ quizId, text, options }).unwrap();
        toast.success('Question added!');
      } else {
        await updateQuestion({ questionId: question._id, data: { text, options } }).unwrap();
        toast.success('Question updated!');
      }
      refetch();
    } catch (err) { toast.error('Failed to save question.'); }
  };

  const handleDeleteQuestion = async (questionId, qIndex) => {
    if (String(questionId).startsWith('new-')) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(qIndex, 1);
      setQuestions(updatedQuestions);
      return;
    }
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(questionId).unwrap();
        toast.success('Question deleted!');
        refetch();
      } catch (err) { toast.error('Failed to delete question.'); }
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">{quizData?.data.title} - Manage Questions</h2>
        {isLoading ? <Loader /> : (
          <div className="flex-grow overflow-y-auto pr-2">
            {questions.map((q, qIndex) => (
              <div key={q._id} className="bg-gray-100 p-4 rounded-lg mb-4">
                {/* --- THIS IS THE FIX --- */}
                <label htmlFor={`question-text-${qIndex}`} className="sr-only">Question Text</label>
                <textarea id={`question-text-${qIndex}`} name={`question-text-${qIndex}`} value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} placeholder="Question Text" className="w-full p-2 border rounded mb-2" />
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center mb-2">
                    <input type="radio" id={`option-radio-${qIndex}-${oIndex}`} name={`correct_opt_${q._id}`} checked={opt.isCorrect} onChange={() => handleCorrectOptionChange(qIndex, oIndex)} className="mr-2" />
                    <label htmlFor={`option-text-${qIndex}-${oIndex}`} className="sr-only">Option Text</label>
                    <input type="text" id={`option-text-${qIndex}-${oIndex}`} name={`option-text-${qIndex}-${oIndex}`} value={opt.text} onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)} placeholder={`Option ${oIndex + 1}`} className="flex-grow p-2 border rounded" />
                  </div>
                ))}
                {/* --- END OF FIX --- */}
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={() => handleDeleteQuestion(q._id, qIndex)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                  <button onClick={() => handleSaveQuestion(q)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Save</button>
                </div>
              </div>
            ))}
            <button onClick={handleAddQuestion} className="w-full bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600">Add New Question</button>
          </div>
        )}
        <div className="mt-4 flex justify-end border-t pt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Close</button>
        </div>
      </div>
    </div>
  );
};
export default ManageQuizModal;