import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Result, CreateResultDto, UpdateResultDto } from "../types";

export const resultsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query<Result[], void>({
      query: () => API_ENDPOINTS.RESULTS.BASE,
      providesTags: ["Result"],
    }),

    getResultById: builder.query<Result, number>({
      query: (id) => API_ENDPOINTS.RESULTS.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Result", id }],
    }),

    getStudentResults: builder.query<Result[], number>({
      query: (studentId) => API_ENDPOINTS.RESULTS.BY_STUDENT(studentId),
      providesTags: ["Result"],
    }),

    saveResult: builder.mutation<
      Result,
      { id?: number; data: CreateResultDto | UpdateResultDto }
    >({
      query: ({ id, data }) => ({
        url: id
          ? API_ENDPOINTS.RESULTS.BY_ID(id)
          : API_ENDPOINTS.RESULTS.BASE,
        method: id ? "PUT" : "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) =>
        id ? [{ type: "Result", id }, "Result"] : ["Result"],
    }),

    deleteResult: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.RESULTS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Result"],
    }),
  }),
});

export const {
  useGetResultsQuery,
  useGetResultByIdQuery,
  useGetStudentResultsQuery,
  useSaveResultMutation,
  useDeleteResultMutation,
} = resultsApi;
