import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useGetCourseByIdQuery } from '../services/courseService';
import { useCreateEnrollmentMutation, useGetMyEnrollmentsQuery, useUnenrollMutation } from '../services/enrollmentService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const CourseDetailPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: courseData, isLoading: isLoadingCourse, error: courseError } = useGetCourseByIdQuery(courseId);
  // We add isLoading to this hook as well
  const { data: myEnrollmentsData, isLoading: isLoadingEnrollments, refetch } = useGetMyEnrollmentsQuery();
  const [createEnrollment, { isLoading: isEnrolling }] = useCreateEnrollmentMutation();
  const [unenroll, { isLoading: isUnenrolling }] = useUnenrollMutation();

  const course = courseData?.data;
  // --- THIS IS THE GUARANTEED FIX ---
  // We add checks to ensure data exists before trying to use it.
  const isAlreadyEnrolled = myEnrollmentsData?.data
    ?.filter(e => e.course) // First, filter out enrollments with null courses
    .some(e => e.course._id === courseId); // Then, run .some() on the safe array

  const isInstructorOfCourse = userInfo?._id === course?.instructor?._id;
  // --- END OF GUARANTEED FIX ---

  const handleEnroll = async () => {
    if (!userInfo) { navigate('/login'); toast.error('You must be logged in to enroll.'); return; }
    try {
      await createEnrollment({ courseId }).unwrap();
      toast.success('Successfully enrolled!');
      refetch();
    } catch (err) { toast.error(err?.data?.message || 'Failed to enroll.'); }
  };

  const handleUnenroll = async () => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await unenroll(courseId).unwrap();
        toast.success('Successfully unenrolled.');
        refetch();
      } catch (err) { toast.error(err?.data?.message || 'Failed to unenroll.'); }
    }
  };

  // We now also check if enrollments are loading
  if (isLoadingCourse || isLoadingEnrollments) {
    return <div className="flex justify-center items-center h-full"><Loader /></div>
  }

  return (
    <div className="container mx-auto">
      <Link to="/courses" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">← Back to All Courses</Link>
      {courseError ? <Message variant="danger">{courseError?.data?.message || courseError.error}</Message> : course ? (
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
          <img className="w-full h-96 object-cover" src={course.thumbnail || '/images/default-course-thumbnail.jpg'} alt={course.title} />
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{course.category.name}</div>
            <h1 className="text-4xl font-extrabold my-2 text-gray-900">{course.title}</h1>
            <p className="text-gray-600">Created by <span className="font-semibold">{course.instructor.name}</span></p>
            <div className="mt-6"><h2 className="text-2xl font-bold text-gray-800 mb-2">Description</h2><p className="text-gray-700 text-lg leading-relaxed">{course.description}</p></div>
            <div className="mt-6 flex flex-wrap gap-4 items-center"><span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">Level: {course.level}</span><span className="bg-green-100 text-green-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">Duration: {course.duration} hours</span></div>
            <div className="mt-8 flex justify-between items-center">
              <p className="text-4xl font-bold text-green-600">₹{course.price}</p>

              {isInstructorOfCourse ? (
                <Link to={`/instructor/courses/${course._id}/manage`} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-purple-700">Manage Your Course</Link>
              ) : isAlreadyEnrolled ? (
                <div className="flex items-center space-x-4">
                  <button onClick={handleUnenroll} disabled={isUnenrolling} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 disabled:bg-red-400">Unenroll</button>
                  <Link to={`/learn/${course._id}`} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-700">Go to Course</Link>
                </div>
              ) : (
                <button onClick={handleEnroll} disabled={isEnrolling} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg disabled:bg-blue-400">{isEnrolling ? 'Enrolling...' : 'Enroll Now'}</button>
              )}
            </div>
          </div>
        </div>
      ) : <Message>Course not found.</Message>}
    </div>
  );
};
export default CourseDetailPage;