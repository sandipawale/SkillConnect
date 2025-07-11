import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useGetCourseByIdQuery } from '../services/courseService';
import { useGetLessonsForCourseQuery, useDeleteLessonMutation } from '../services/lessonService';
import { useLazyGetQuizForLessonQuery, useCreateQuizMutation } from '../services/quizService';
import { useLazyGetAssignmentForLessonQuery } from '../services/assignmentService';
import Loader from '../components/common/Loader';
import LessonList from '../components/lesson/LessonList';
import AddLessonModal from '../components/lesson/AddLessonModal';
import EditLessonModal from '../components/lesson/EditLessonModal';
import ManageQuizModal from '../components/quiz/ManageQuizModal';
import EditCourseDetailsModal from '../components/course/EditCourseDetailsModal';
import EditThumbnailModal from '../components/course/EditThumbnailModal';
import ManageAssignmentModal from '../components/assignment/ManageAssignmentModal';
import ViewSubmissionsModal from '../components/assignment/ViewSubmissionsModal';
import GradeSubmissionModal from '../components/assignment/GradeSubmissionModal';

const ManageCoursePage = () => {
  const { courseId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo && userInfo.role === 'admin';

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showEditLesson, setShowEditLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showManageQuiz, setShowManageQuiz] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [showEditThumbnail, setShowEditThumbnail] = useState(false);
  const [showManageAssignment, setShowManageAssignment] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [showViewSubmissions, setShowViewSubmissions] = useState(false);
  const [showGradeSubmission, setShowGradeSubmission] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  const { data: courseData, isLoading: isLoadingCourse, refetch: refetchCourse } = useGetCourseByIdQuery(courseId);
  const { data: lessonsData, isLoading: isLoadingLessons } = useGetLessonsForCourseQuery(courseId);
  const [deleteLesson] = useDeleteLessonMutation();
  const [createQuiz] = useCreateQuizMutation();
  const [triggerGetQuiz] = useLazyGetQuizForLessonQuery();
  const [triggerGetAssignment] = useLazyGetAssignmentForLessonQuery();

  const course = courseData?.data;

  const handleEditClick = (lesson) => { setCurrentLesson(lesson); setShowEditLesson(true); };
  const handleDeleteClick = async (lessonId) => {
    if (window.confirm('Are you sure?')) {
      try { await deleteLesson(lessonId).unwrap(); toast.success('Lesson deleted'); } 
      catch (err) { toast.error('Failed to delete lesson.'); }
    }
  };
  const handleManageQuiz = async (lesson) => {
    try {
      const existingQuiz = await triggerGetQuiz(lesson._id).unwrap();
      if (existingQuiz?.data) { setCurrentQuizId(existingQuiz.data._id); } 
      else {
        const newQuiz = await createQuiz({ lessonId: lesson._id, title: `Quiz for ${lesson.title}`, description: 'A quiz to test your knowledge.' }).unwrap();
        setCurrentQuizId(newQuiz.data._id);
      }
      setShowManageQuiz(true);
    } catch (err) { toast.error("An unexpected error occurred while handling the quiz."); }
  };
  const handleManageAssignment = async (lesson) => {
    try {
      const { data: existingAssignment } = await triggerGetAssignment(lesson._id).unwrap();
      setCurrentLesson(lesson);
      setCurrentAssignment(existingAssignment);
      setShowManageAssignment(true);
    } catch (err) { toast.error("An error occurred while checking for an assignment."); }
  };
  const handleViewSubmissions = (assignment) => {
    setCurrentAssignment(assignment);
    setShowViewSubmissions(true);
  };
  const handleGradeSubmission = (submission) => {
    setCurrentSubmission(submission);
    setShowViewSubmissions(false);
    setShowGradeSubmission(true);
  };
  const handleCloseGradeModal = () => { setShowGradeSubmission(false); setShowViewSubmissions(true); };
  const handleCloseEditCourse = () => { setShowEditCourse(false); refetchCourse(); };
  const handleCloseEditThumbnail = () => { setShowEditThumbnail(false); refetchCourse(); };

  if (isLoadingCourse || isLoadingLessons) return <Loader />;

  return (
    <>
      {showAddLesson && <AddLessonModal courseId={courseId} onClose={() => setShowAddLesson(false)} />}
      {showEditLesson && <EditLessonModal lesson={currentLesson} onClose={() => setShowEditLesson(false)} />}
      {showManageQuiz && <ManageQuizModal quizId={currentQuizId} onClose={() => setShowManageQuiz(false)} />}
      {showEditCourse && <EditCourseDetailsModal course={course} onClose={handleCloseEditCourse} />}
      {showEditThumbnail && <EditThumbnailModal course={course} onClose={handleCloseEditThumbnail} />}
      {showManageAssignment && <ManageAssignmentModal lesson={currentLesson} assignment={currentAssignment} onClose={() => setShowManageAssignment(false)} />}
      {showViewSubmissions && <ViewSubmissionsModal assignment={currentAssignment} onGrade={handleGradeSubmission} onClose={() => setShowViewSubmissions(false)} />}
      {showGradeSubmission && <GradeSubmissionModal submission={currentSubmission} onClose={handleCloseGradeModal} />}

      <div className="container mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <Link to={isAdmin ? "/admin/courses" : "/instructor/dashboard"} className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          ← {isAdmin ? "Back to All Courses" : "Back to My Courses"}
        </Link>
        <div className="bg-gray-100 p-6 rounded-lg mb-6 flex justify-between items-start">
          <div><h1 className="text-3xl font-bold">{course?.title}</h1><p className="text-gray-600">Price: ₹{course?.price} | Duration: {course?.duration} hours</p></div>
          {isAdmin && (<div className="flex space-x-2"><button onClick={() => setShowEditThumbnail(true)} className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">Edit Thumbnail</button><button onClick={() => setShowEditCourse(true)} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">Edit Details</button></div>)}
        </div>
        <div className="flex justify-end mb-4"><button onClick={() => setShowAddLesson(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">+ Add Lesson</button></div>
        <LessonList lessons={lessonsData?.data} onEdit={handleEditClick} onDelete={handleDeleteClick} onManageQuiz={handleManageQuiz} onManageAssignment={handleManageAssignment} onViewSubmissions={handleViewSubmissions} />
      </div>
    </>
  );
};
export default ManageCoursePage;