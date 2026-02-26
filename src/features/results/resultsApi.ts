import { apiSlice } from '../../app/api/apiSlice';
import { Result, CreateResultDto, UpdateResultDto } from '../../types';

export const resultsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query<Result[], void>({
      query: () => '/api/results',
      providesTags: ['Result'],
    }),
    getResultById: builder.query<Result, number>({
      query: (id) => `/api/results/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Result', id }],
    }),
    getStudentResults: builder.query<Result[], number>({
      query: (studentId) => `/api/results/student/${studentId}`,
      providesTags: ['Result'],
    }),
    createResult: builder.mutation<Result, CreateResultDto>({
      query: (data) => ({ url: '/api/results', method: 'POST', body: data }),
      invalidatesTags: ['Result'],
    }),
    updateResult: builder.mutation<Result, { id: number; data: UpdateResultDto }>({
      query: ({ id, data }) => ({ url: `/api/results/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Result', id }, 'Result'],
    }),
    deleteResult: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/results/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Result'],
    }),
  }),
});

export const {
  useGetResultsQuery,
  useGetResultByIdQuery,
  useGetStudentResultsQuery,
  useCreateResultMutation,
  useUpdateResultMutation,
  useDeleteResultMutation,
} = resultsApi;
