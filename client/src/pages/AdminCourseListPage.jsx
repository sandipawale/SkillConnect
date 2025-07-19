import React from 'react';
import { useGetCoursesQuery, useDeleteCourseMutation } from '../services/courseService';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-hot-toast';

// A reusable component for rendering a table of courses for a specific instructor
const InstructorCourseTable = ({ instructorName, courses, deleteHandler, isLoadingDelete }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 text-gray-700">
      Courses by: <span className="font-extrabold">{instructorName}</span>
    </h2>
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Course Title</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-center">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr> 
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {courses.map((course) => (
            <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left font-semibold">{course.title}</td>
              <td className="py-3 px-6 text-left">{course.category?.name || 'N/A'}</td>
              <td className="py-3 px-6 text-center">
                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${course.isPublished ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center space-x-4">
                  <Link to={`/instructor/courses/${course._id}/manage`} className="text-blue-600 hover:underline">
                    Manage
                  </Link>
                  <button onClick={() => deleteHandler(course._id)} disabled={isLoadingDelete} className="text-red-600 hover:underline disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminCourseListPage = () => {
  const { data: coursesData, isLoading, error, refetch } = useGetCoursesQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const deleteHandler = async (courseId) => {
    if (window.confirm('Are you sure you want to permanently delete this course?')) {
      try {
        await deleteCourse(courseId).unwrap();
        toast.success('Course deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete course.');
      }
    }
  };

  // Group courses by instructor
  const coursesByInstructor = coursesData?.data?.reduce((acc, course) => {
    // Ensure instructor exists before trying to access properties
    if (course.instructor && course.instructor._id) {
        const instructorId = course.instructor._id;
        if (!acc[instructorId]) {
          acc[instructorId] = {
            name: course.instructor.name,
            courses: [],
          };
        }
        acc[instructorId].courses.push(course);
    }
    return acc;
  }, {});

  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800">Manage All Courses</h1>

        {isLoading || isDeleting ? <Loader /> : error ? (
          <Message variant="danger">{error?.data?.message || error.error || 'Could not fetch courses.'}</Message>
        ) : (
          <>
            {!coursesByInstructor || Object.keys(coursesByInstructor).length === 0 ? (
              <Message>There are no courses on the platform yet.</Message>
            ) : (
              // Render a separate table for each instructor group
              Object.values(coursesByInstructor).map(instructorGroup => (
                <InstructorCourseTable
                  key={instructorGroup.name}
                  instructorName={instructorGroup.name}
                  courses={instructorGroup.courses}
                  deleteHandler={deleteHandler}
                  isLoadingDelete={isDeleting}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCourseListPage;