import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Subject, CreateSubjectDto, UpdateSubjectDto } from "../types";

export const subjectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], void>({
      query: () => API_ENDPOINTS.SUBJECTS.BASE,
      providesTags: ["Subject"],
    }),

    getSubjectById: builder.query<Subject, number>({
      query: (id) => API_ENDPOINTS.SUBJECTS.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Subject", id }],
    }),

    saveSubject: builder.mutation<
      Subject,
      { id?: number; data: CreateSubjectDto | UpdateSubjectDto }
    >({
      query: ({ id, data }) => ({
        url: id
          ? API_ENDPOINTS.SUBJECTS.BY_ID(id)
          : API_ENDPOINTS.SUBJECTS.BASE,
        method: id ? "PUT" : "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) =>
        id ? [{ type: "Subject", id }, "Subject"] : ["Subject"],
    }),

    deleteSubject: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.SUBJECTS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useSaveSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsApi;
