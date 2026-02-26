import { apiSlice } from '../../app/api/apiSlice';
import { Exam, CreateExamDto, UpdateExamDto } from '../../types';

export const examsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => '/api/exams',
      providesTags: ['Exam'],
    }),
    getExamById: builder.query<Exam, number>({
      query: (id) => `/api/exams/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Exam', id }],
    }),
    createExam: builder.mutation<Exam, CreateExamDto>({
      query: (data) => ({ url: '/api/exams', method: 'POST', body: data }),
      invalidatesTags: ['Exam'],
    }),
    updateExam: builder.mutation<Exam, { id: number; data: UpdateExamDto }>({
      query: ({ id, data }) => ({ url: `/api/exams/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Exam', id }, 'Exam'],
    }),
    deleteExam: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/exams/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Exam'],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examsApi;
