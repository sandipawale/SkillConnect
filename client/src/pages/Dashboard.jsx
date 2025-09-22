import React from 'react';
import { useGetMyEnrollmentsQuery } from '../services/enrollmentService';
import CourseCard from '../components/course/CourseCard';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { data, isLoading, error } = useGetMyEnrollmentsQuery();

  // --- THIS IS THE FIX --
  // Filter out any enrollments where the course might have been deleted or is null
  const validEnrollments = data?.data?.filter(enrollment => enrollment.course);
  // --- END OF FIX ---

  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          My Courses
        </h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Could not fetch your courses.'}
          </Message>
        ) : (
          <>
            {!validEnrollments || validEnrollments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xl text-gray-700">You are not enrolled in any courses yet.</p>
                <Link
                  to="/courses"
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {validEnrollments.map((enrollment) => (
                  <CourseCard key={enrollment._id} course={enrollment.course} baseLink="/learn" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 