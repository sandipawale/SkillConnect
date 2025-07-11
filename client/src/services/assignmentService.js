import { apiSlice } from '../store/slices/apiSlice';

const ASSIGNMENTS_URL = '/api/assignments';

export const assignmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentForLesson: builder.query({
      query: (lessonId) => `${ASSIGNMENTS_URL}/lesson/${lessonId}`,
      providesTags: (result, error, id) => [{ type: 'Assignment', id }],
    }),
    getAssignmentById: builder.query({ // Add the new query
      query: (assignmentId) => `${ASSIGNMENTS_URL}/${assignmentId}`,
      providesTags: (result, error, id) => [{ type: 'Assignment', id }],
    }),
    createOrUpdateAssignment: builder.mutation({
      query: (data) => ({ url: ASSIGNMENTS_URL, method: 'POST', body: data }),
      invalidatesTags: ['Assignment'],
    }),
    getSubmissionsForAssignment: builder.query({
      query: (assignmentId) => `${ASSIGNMENTS_URL}/${assignmentId}/submissions`,
      providesTags: ['Submission'],
    }),
    gradeSubmission: builder.mutation({
      query: ({ submissionId, data }) => ({ url: `${ASSIGNMENTS_URL}/submissions/${submissionId}/grade`, method: 'PUT', body: data }),
      invalidatesTags: ['Submission'],
    }),
    submitAssignment: builder.mutation({
      query: (data) => ({ url: `${ASSIGNMENTS_URL}/submit`, method: 'POST', body: data }),
      invalidatesTags: ['Submission'],
    }),
    getMySubmission: builder.query({
      query: (assignmentId) => `${ASSIGNMENTS_URL}/${assignmentId}/mysubmission`,
      providesTags: ['Submission'],
    }),
  }),
});

export const {
  useGetAssignmentForLessonQuery,
  useLazyGetAssignmentForLessonQuery,
  useGetAssignmentByIdQuery, // Export the new hook
  useCreateOrUpdateAssignmentMutation,
  useGetSubmissionsForAssignmentQuery,
  useGradeSubmissionMutation,
  useSubmitAssignmentMutation,
  useGetMySubmissionQuery,
} = assignmentApiSlice;