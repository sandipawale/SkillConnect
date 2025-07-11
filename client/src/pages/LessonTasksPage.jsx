import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGetEnrollmentForCourseQuery, useUpdateProgressMutation } from '../services/enrollmentService';
import { useGetQuizForLessonQuery } from '../services/quizService';
import { useGetAssignmentForLessonQuery } from '../services/assignmentService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const LessonTasksPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const { data: enrollmentData, isLoading: l1 } = useGetEnrollmentForCourseQuery(courseId);
  const { data: quizData, isLoading: l2 } = useGetQuizForLessonQuery(lessonId);
  const { data: assignmentData, isLoading: l3 } = useGetAssignmentForLessonQuery(lessonId);
  const [updateProgress, { isLoading: isUpdatingProgress }] = useUpdateProgressMutation();

  const isLessonCompleted = enrollmentData?.data?.progress?.find(p => p.lessonId === lessonId)?.completed;

  // --- THIS IS THE FIX ---
  // A single handler that can mark as complete or incomplete
  const handleProgressUpdate = async (status) => {
    try {
      await updateProgress({ courseId, lessonId, completed: status }).unwrap();
      toast.success(`Lesson marked as ${status ? 'complete' : 'incomplete'}!`);
    } catch (err) {
      toast.error('Could not save progress.');
    }
  };
  // --- END OF FIX ---

  if (l1 || l2 || l3) return <div className="flex justify-center items-center h-full"><Loader /></div>;

  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <Link to={`/learn/${courseId}`} className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          ← Back to Lesson Content
        </Link>
        <h1 className="text-3xl font-bold border-b pb-4 mb-6">Tasks for this Lesson</h1>
        <div className="space-y-4">
          {!isLessonCompleted ? (
            <button onClick={() => handleProgressUpdate(true)} disabled={isUpdatingProgress} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400">
              {isUpdatingProgress ? 'Saving...' : 'Mark as Complete'}
            </button>
          ) : (
            <>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <p className="font-semibold text-green-800">Lesson Complete! You can now access the tasks below.</p>
              </div>

              {quizData?.data ? (
                <button onClick={() => navigate(`/quiz/lesson/${lessonId}`)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">
                  Take Quiz
                </button>
              ) : null}

              {assignmentData?.data ? (
                <button onClick={() => navigate(`/assignment/${assignmentData.data._id}`)} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600">
                  View Assignment
                </button>
              ) : null}

              {!quizData?.data && !assignmentData?.data && (
                  <Message>Great job! This lesson has no additional tasks.</Message>
              )}

              <hr className="my-4"/>
              <button onClick={() => handleProgressUpdate(false)} disabled={isUpdatingProgress} className="w-full bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-400">
                {isUpdatingProgress ? 'Saving...' : 'Mark as Incomplete'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default LessonTasksPage;