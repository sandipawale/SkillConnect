import { apiSlice } from '../store/slices/apiSlice';

const COURSES_URL = '/api/courses';

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({ url: COURSES_URL }),
      providesTags: (result) => 
        result ? [ ...result.data.map(({ _id }) => ({ type: 'Course', id: _id })), { type: 'Course', id: 'LIST' }, ] : [{ type: 'Course', id: 'LIST' }],
      // --- THIS IS THE FIX ---
      // Keep the data in the cache for 60 seconds after the component unmounts
      keepUnusedDataFor: 60,
      // --- END OF FIX ---
    }),
    getCourseById: builder.query({
      query: (courseId) => ({ url: `${COURSES_URL}/${courseId}` }),
      providesTags: (result, error, id) => [{ type: 'Course', id }],
      keepUnusedDataFor: 60, // Also cache single course pages
    }),
    createCourse: builder.mutation({
      query: (data) => ({ url: COURSES_URL, method: 'POST', body: data }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation({
      query: ({ courseId, data }) => ({
        url: `${COURSES_URL}/${courseId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }, { type: 'Course', id: 'LIST' }],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${COURSES_URL}/${courseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
  }),
});

export const { 
  useGetCoursesQuery, 
  useGetCourseByIdQuery, 
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation 
} = courseApiSlice;