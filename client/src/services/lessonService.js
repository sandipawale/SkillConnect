import { apiSlice } from '../store/slices/apiSlice';

export const lessonApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLessonsForCourse: builder.query({
      query: (courseId) => ({
        url: `/api/courses/${courseId}/lessons`,
      }),
      providesTags: (result, error, courseId) => [
        { type: 'Lesson', id: 'LIST' },
        ...(result?.data.map(({ _id }) => ({ type: 'Lesson', id: _id })) || [])
      ],
      keepUnusedDataFor: 5,
    }),
    addLesson: builder.mutation({
      query: ({ courseId, data }) => ({
        url: `/api/courses/${courseId}/lessons`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Lesson', id: 'LIST' }],
    }),
    updateLesson: builder.mutation({
      query: ({ lessonId, data }) => ({
        url: `/api/lessons/${lessonId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { lessonId }) => [{ type: 'Lesson', id: lessonId }],
    }),
    deleteLesson: builder.mutation({
      query: (lessonId) => ({
        url: `/api/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Lesson', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLessonsForCourseQuery,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApiSlice;