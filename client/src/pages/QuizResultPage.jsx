import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetQuizAttemptByIdQuery } from '../services/quizService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const QuizResultPage = () => {
  const { attemptId } = useParams();
  const { data: attemptData, isLoading, error } = useGetQuizAttemptByIdQuery(attemptId);
  
  const attempt = attemptData?.data;
  const courseId = attempt?.quiz.lesson.course;

  if (isLoading) return <div className="flex justify-center items-center h-full"><Loader /></div>;
  if (error || !attempt) return <Message variant="danger">Could not load your quiz results.</Message>;
  
  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const passed = percentage >= 70; // Example passing score

  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-lg shadow-xl max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-lg text-gray-600 mb-6">Results for: <span className="font-semibold">{attempt.quiz.title}</span></p>

          <div className="my-8">
              {passed ? (
                <div className="text-green-500">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="text-2xl font-semibold mt-2">Congratulations, you passed!</p>
                </div>
              ) : (
                <div className="text-red-500">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="text-2xl font-semibold mt-2">Keep Trying!</p>
                </div>
              )}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-2xl text-gray-700 mb-2">Your Score:</p>
            <p className="text-6xl font-extrabold text-blue-600">{attempt.score} / {attempt.totalQuestions}</p>
            <p className="text-4xl font-bold text-gray-800 mt-2">{percentage}%</p>
          </div>
          
          {courseId && (
            <Link to={`/learn/${courseId}`} className="mt-8 inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              ← Back to Course Lessons
            </Link>
          )}
      </div>
    </div>
  );
};

export default QuizResultPage;