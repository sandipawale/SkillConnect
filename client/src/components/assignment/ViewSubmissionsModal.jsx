import { useGetSubmissionsForAssignmentQuery } from '../../services/assignmentService';
import Loader from '../common/Loader';
import Message from '../common/Message';

const ViewSubmissionsModal = ({ assignment, onGrade, onClose }) => {
  const { data: submissionsData, isLoading, error } = useGetSubmissionsForAssignmentQuery(assignment?._id, {
    skip: !assignment, // Don't run the query if there's no assignment
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold p-6 border-b flex-shrink-0">
          Submissions for: {assignment?.title}
        </h2>
        
        <div className="p-6 overflow-y-auto">
          {isLoading ? <Loader /> : error ? <Message variant="danger">Could not load submissions.</Message> : (
            submissionsData?.data?.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-6 text-left">Student</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-center">Grade</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {submissionsData.data.map(sub => (
                    <tr key={sub._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{sub.student.name} ({sub.student.email})</td>
                      <td className="py-3 px-6 text-left">
                        <span className={`py-1 px-3 rounded-full text-xs font-semibold ${sub.status === 'Graded' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">{sub.grade ?? 'N/A'}</td>
                      <td className="py-3 px-6 text-center">
                        <button onClick={() => onGrade(sub)} className="text-blue-600 hover:underline">
                          View & Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Message>No submissions for this assignment yet.</Message>
            )
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t mt-auto flex-shrink-0">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewSubmissionsModal;