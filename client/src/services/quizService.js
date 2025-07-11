import { apiSlice } from '../store/slices/apiSlice';

const QUIZZES_URL = '/api/quizzes';
const QUESTIONS_URL = '/api/questions';

export const quizApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizForLesson: builder.query({
      query: (lessonId) => `${QUIZZES_URL}/lesson/${lessonId}`,
      providesTags: (result, error, id) => [{ type: 'Quiz', id }],
    }),
    getQuizByIdForInstructor: builder.query({
      query: (quizId) => `${QUIZZES_URL}/${quizId}`,
      providesTags: (result, error, id) => [{ type: 'Quiz', id }],
    }),
    getQuizAttemptById: builder.query({ // Add new query
      query: (attemptId) => `${QUIZZES_URL}/attempt/${attemptId}`,
      providesTags: (result, error, id) => [{ type: 'QuizAttempt', id }],
    }),
    createQuiz: builder.mutation({
      query: (data) => ({ url: QUIZZES_URL, method: 'POST', body: data }),
      invalidatesTags: ['Quiz'],
    }),
    submitQuiz: builder.mutation({
      query: (data) => ({ url: `${QUIZZES_URL}/submit`, method: 'POST', body: data }),
    }),
    addQuestion: builder.mutation({
      query: (data) => ({ url: QUESTIONS_URL, method: 'POST', body: data }),
      invalidatesTags: (result, error, { quizId }) => [{ type: 'Quiz', id: quizId }],
    }),
    updateQuestion: builder.mutation({
      query: ({ questionId, data }) => ({ url: `${QUESTIONS_URL}/${questionId}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { questionId }) => ['Quiz'],
    }),
    deleteQuestion: builder.mutation({
      query: (questionId) => ({ url: `${QUESTIONS_URL}/${questionId}`, method: 'DELETE' }),
      invalidatesTags: ['Quiz'],
    }),
  }),
});

export const {
  useGetQuizForLessonQuery,
  useLazyGetQuizForLessonQuery,
  useGetQuizByIdForInstructorQuery,
  useGetQuizAttemptByIdQuery, // Export new hook
  useCreateQuizMutation,
  useSubmitQuizMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = quizApiSlice;