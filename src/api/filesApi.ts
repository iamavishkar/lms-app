import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { FileUploadResponse } from "../types";

export const filesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.FILES.UPLOAD,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = filesApi;
