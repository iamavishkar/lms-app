import { apiSlice } from '../../app/api/apiSlice';
import { FileUploadResponse } from '../../types';

export const filesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: '/api/files/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = filesApi;
