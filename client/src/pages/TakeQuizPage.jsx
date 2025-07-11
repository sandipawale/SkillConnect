import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetQuizForLessonQuery, useSubmitQuizMutation } from '../services/quizService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-hot-toast';

const TakeQuizPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  const { data: quizData, isLoading, error } = useGetQuizForLessonQuery(lessonId);
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  
  const [answers, setAnswers] = useState({});
  const quiz = quizData?.data;
  const courseId = quiz?.lesson?.course;

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error('Please answer all questions before submitting.'); return;
    }
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId, selectedOption }));
    try {
      // --- THIS IS THE FIX ---
      // We get the result which contains the new attempt ID
      const result = await submitQuiz({ quizId: quiz._id, answers: formattedAnswers }).unwrap();
      toast.success('Quiz submitted!');
      // And navigate to the result page with the attempt ID
      navigate(`/quiz/result/${result.data._id}`);
      // --- END OF FIX ---
    } catch(err) {
      toast.error('Failed to submit quiz.');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-full"><Loader /></div>;
  if (error || !quiz) return <Message variant="danger">Could not load quiz for this lesson.</Message>;
  
  const hasQuestions = quiz.questions && quiz.questions.length > 0;

  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-extrabold text-center mb-6">{quiz.title}</h1>
        {hasQuestions ? (
          <>
            <div className="space-y-8">
              {quiz.questions.map((q, index) => (
                 <div key={q._id} className="bg-gray-50 p-6 rounded-lg border">
                  <p className="text-lg font-semibold mb-4 text-gray-800">{index + 1}. {q.text}</p>
                  <div className="space-y-3">
                    {q.options.map((option, oIndex) => (
                      <label key={oIndex} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-100 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300 transition-colors">
                        <input type="radio" name={q._id} value={oIndex} onChange={() => handleAnswerSelect(q._id, oIndex)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white px-10 py-3 rounded-lg text-lg font-bold hover:bg-green-700">{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-2xl font-semibold text-gray-700">Quiz Coming Soon!</p>
            {courseId && (
              <Link to={`/learn/${courseId}`} className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                ← Back to Lesson
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TakeQuizPage;