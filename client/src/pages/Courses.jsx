import React from 'react';
import { useGetCoursesQuery } from '../services/courseService';
import CourseCard from '../components/course/CourseCard';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const CoursesPage = () => {
  const { data: coursesData, isLoading, error } = useGetCoursesQuery();
  
  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Explore Our Courses
        </h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'An error occurred while fetching courses.'}
          </Message>
        ) : (
          // Changed grid columns to a maximum of 2 on large screens
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coursesData?.data?.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
        {!isLoading && !error && coursesData?.data?.length === 0 && (
          <Message>No courses found. Check back later!</Message>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;