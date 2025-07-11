import { apiSlice } from '../store/slices/apiSlice';

const ENROLLMENTS_URL = '/api/enrollments';

export const enrollmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEnrollment: builder.mutation({
      query: (data) => ({ url: ENROLLMENTS_URL, method: 'POST', body: data }),
      invalidatesTags: ['Enrollment'],
    }),
    getMyEnrollments: builder.query({
      query: () => ({ url: `${ENROLLMENTS_URL}/my` }),
      providesTags: ['Enrollment'],
      keepUnusedDataFor: 5,
    }),
    getEnrollmentForCourse: builder.query({
      query: (courseId) => ({ url: `${ENROLLMENTS_URL}/course/${courseId}` }),
      providesTags: (result, error, courseId) => [{ type: 'Enrollment', id: courseId }],
    }),
    updateProgress: builder.mutation({
      query: (data) => ({ url: `${ENROLLMENTS_URL}/progress`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Enrollment', id: courseId }],
    }),
    unenroll: builder.mutation({ // NEW MUTATION
      query: (courseId) => ({
        url: `${ENROLLMENTS_URL}/course/${courseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Enrollment'],
    }),
  }),
});

export const { useCreateEnrollmentMutation, useGetMyEnrollmentsQuery, useGetEnrollmentForCourseQuery, useUpdateProgressMutation, useUnenrollMutation } = enrollmentApiSlice;