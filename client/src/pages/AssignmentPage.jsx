import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGetAssignmentByIdQuery, useGetMySubmissionQuery, useSubmitAssignmentMutation } from '../services/assignmentService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

// The CSS is now loaded in index.html, so we only need the JS hook
import { useQuill } from 'react-quilljs';

const AssignmentPage = () => {
  const { assignmentId } = useParams();
  
  const { quill, quillRef } = useQuill();
  const [submissionContent, setSubmissionContent] = useState('');
  const { data: assignmentData, isLoading: isLoadingAssignment } = useGetAssignmentByIdQuery(assignmentId);
  const { data: submissionData, isLoading: isLoadingSubmission, refetch } = useGetMySubmissionQuery(assignmentId, { skip: !assignmentId });
  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();

  const assignment = assignmentData?.data;
  const submission = submissionData?.data;
  const courseId = assignment?.lesson?.course;

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setSubmissionContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionContent || submissionContent === '<p><br></p>') return toast.error('Submission content cannot be empty.');
    try {
      await submitAssignment({ assignmentId, submissionContent }).unwrap();
      toast.success('Assignment submitted!');
      refetch();
    } catch(err) {
      toast.error(err?.data?.message || 'Failed to submit assignment.');
    }
  };

  if (isLoadingAssignment || isLoadingSubmission) return <div className="flex justify-center items-center h-full"><Loader /></div>;
  if (!assignment) return <Message>Assignment not found.</Message>;

  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        {courseId && (
          <Link to={`/learn/${courseId}`} className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
            ← Back to Course Lessons
          </Link>
        )}
        <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
        <div className="prose max-w-none p-4 bg-gray-100 rounded-md"><p>{assignment.instructions}</p></div>
        <hr className="my-8" />
        {submission ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Submission</h2>
            <div className="bg-green-50 p-4 border rounded-md">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: submission.submissionContent }} />
              <p className="text-sm text-gray-500 mt-4">Submitted: {new Date(submission.createdAt).toLocaleString()}</p>
              <p className={`mt-2 font-bold ${submission.status === 'Graded' ? 'text-green-600' : 'text-yellow-600'}`}>Status: {submission.status}</p>
              {submission.status === 'Graded' && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-bold text-lg">Feedback:</h3>
                  <p className="text-gray-700">{submission.feedback || 'No feedback provided.'}</p>
                  <p className="font-bold text-xl mt-2">Grade: {submission.grade} / 100</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Submit Your Assignment</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ width: '100%', minHeight: '200px', backgroundColor: 'white' }}>
                <div ref={quillRef} />
              </div>
              <button type="submit" disabled={isSubmitting} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">{isSubmitting ? 'Submitting...' : 'Submit Work'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default AssignmentPage;