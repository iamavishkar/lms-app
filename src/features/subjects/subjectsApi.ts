import { apiSlice } from '../../app/api/apiSlice';
import { Subject, CreateSubjectDto, UpdateSubjectDto } from '../../types';

export const subjectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], void>({
      query: () => '/api/subjects',
      providesTags: ['Subject'],
    }),
    getSubjectById: builder.query<Subject, number>({
      query: (id) => `/api/subjects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Subject', id }],
    }),
    createSubject: builder.mutation<Subject, CreateSubjectDto>({
      query: (data) => ({ url: '/api/subjects', method: 'POST', body: data }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation<Subject, { id: number; data: UpdateSubjectDto }>({
      query: ({ id, data }) => ({ url: `/api/subjects/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Subject', id }, 'Subject'],
    }),
    deleteSubject: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/subjects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Subject'],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsApi;
