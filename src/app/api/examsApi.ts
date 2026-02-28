import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Exam, CreateExamDto } from "../../interfaces";

export const examsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => API_ENDPOINTS.EXAMS.BASE,
      providesTags: ["Exam"],
    }),

    getExamById: builder.query<Exam, number>({
      query: (id) => API_ENDPOINTS.EXAMS.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Exam", id }],
    }),

    saveExam: builder.mutation<Exam, { id?: number; data: CreateExamDto | Partial<CreateExamDto> }>(
      {
        query: ({ id, data }) => ({
          url: id ? API_ENDPOINTS.EXAMS.BY_ID(id) : API_ENDPOINTS.EXAMS.BASE,
          method: id ? "PUT" : "POST",
          body: data,
        }),
        invalidatesTags: (_r, _e, { id }) => (id ? [{ type: "Exam", id }, "Exam"] : ["Exam"]),
      }
    ),

    deleteExam: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.EXAMS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Exam"],
    }),
  }),
});

export const { useGetExamsQuery, useGetExamByIdQuery, useSaveExamMutation, useDeleteExamMutation } =
  examsApi;
