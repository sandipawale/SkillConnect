import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, baseLink = '/courses' }) => {
  // --- THIS IS THE FIX ---
  // If for any reason the course prop is null or undefined, render nothing.
  if (!course) {
    return null;
  }
  // --- END OF FIX ---

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 flex flex-col h-full">
      <Link to={`${baseLink}/${course._id}`}>
        <img 
          className="w-full h-48 object-cover" 
          src={course.thumbnail || '/images/default-course-thumbnail.jpg'} 
          alt={course.title} 
        />
      </Link>
      <div className="px-6 py-4 flex-grow">
        <div className="font-bold text-xl mb-2 text-gray-800">
          <Link to={`${baseLink}/${course._id}`} className="hover:text-blue-600">
            {course.title}
          </Link>
        </div>
        <p className="text-gray-700 text-base">
          {course.description.substring(0, 100)}...
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #{course.category?.name || 'Uncategorized'}
        </span>
        <span className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-800 mr-2 mb-2">
          {course.level}
        </span>
      </div>
       <div className="px-6 pb-4 flex justify-between items-center mt-auto">
        <p className="text-sm text-gray-600">
          By {course.instructor?.name || 'Unknown'}
        </p>
        <p className="text-lg font-bold text-green-600">
          ₹{course.price}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;