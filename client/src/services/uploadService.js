import { apiSlice } from '../store/slices/apiSlice';

const UPLOAD_URL = '/api/upload';

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: formData,
        // Let the browser set the Content-Type to multipart/form-data
        // by not specifying it here.
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApiSlice;