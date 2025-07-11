import { apiSlice } from '../store/slices/apiSlice';

const CATEGORIES_URL = '/api/categories';

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Category', id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApiSlice;