import React from 'react';
import { useGetAssignmentForLessonQuery } from '../../services/assignmentService';

// A small sub-component to handle the assignment button logic
const AssignmentButtons = ({ lesson, onManageAssignment, onViewSubmissions }) => {
  const { data: assignmentData } = useGetAssignmentForLessonQuery(lesson._id);
  const assignment = assignmentData?.data;

  return (
    <>
      <button onClick={() => onManageAssignment(lesson)} className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
        {assignment ? 'Edit Assignment' : 'Add Assignment'}
      </button>
      {assignment && (
        <button onClick={() => onViewSubmissions(assignment)} className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600">
          Submissions
        </button>
      )}
    </>
  );
};

const LessonList = ({ lessons, onEdit, onDelete, onManageQuiz, onManageAssignment, onViewSubmissions }) => {
  return (
    <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
      <h3 className="text-2xl font-bold p-4 border-b">Course Lessons</h3>
      {lessons && lessons.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {lessons.map((lesson, index) => (
            <li key={lesson._id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Lesson {index + 1}: {lesson.title}</p>
                <p className="text-sm text-gray-500">Duration: {lesson.duration} mins</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <AssignmentButtons lesson={lesson} onManageAssignment={onManageAssignment} onViewSubmissions={onViewSubmissions} />
                <button onClick={() => onManageQuiz(lesson)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">Quiz</button>
                <button onClick={() => onEdit(lesson)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                <button onClick={() => onDelete(lesson._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4 text-gray-500">No lessons have been added to this course yet.</p>
      )}
    </div>
  );
};
export default LessonList;