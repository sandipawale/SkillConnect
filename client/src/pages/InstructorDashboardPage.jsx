import React from 'react';
import { useGetCoursesQuery } from '../services/courseService';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const InstructorDashboardPage = () => {
  const { data: coursesData, isLoading, error } = useGetCoursesQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const instructorCourses = coursesData?.data?.filter(
    (course) => course.instructor._id === userInfo._id
  );

  return (
    <div className="container mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">My Courses Dashboard</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error || 'Could not fetch your courses.'}
        </Message>
      ) : (
        <>
          {instructorCourses?.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-xl text-gray-700">You have not created any courses yet.</p>
              <Link
                to="/courses/create"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Create Your First Course
              </Link>
            </div>
          ) : (
            // This structure creates the single-column list view
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {instructorCourses?.map((course) => (
                  <li key={course._id} className="p-4 hover:bg-gray-50">
                    <Link
                      to={`/instructor/courses/${course._id}/manage`}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-500">{course.isPublished ? 'Published' : 'Draft'}</p>
                      </div>
                      <span className="text-blue-500 font-semibold">Manage →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstructorDashboardPage;