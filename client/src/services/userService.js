import { apiSlice } from '../store/slices/apiSlice';

const USERS_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation for a user to update their own profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    
    // --- ADMIN QUERIES AND MUTATIONS ---

    // Query for an admin to get all users
    getUsers: builder.query({
      query: () => USERS_URL,
      providesTags: ['User'], // Cache users under the 'User' tag
      keepUnusedDataFor: 5,
    }),

    // Query for an admin to get a single user by ID
    getUserById: builder.query({
      query: (userId) => `${USERS_URL}/${userId}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
      keepUnusedDataFor: 5,
    }),

    // Mutation for an admin to update a user
    updateUser: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'], // Invalidate the user cache
    }),

    // Mutation for an admin to delete a user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'], // Invalidate the user cache
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;