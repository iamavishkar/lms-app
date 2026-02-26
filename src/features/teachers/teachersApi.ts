import { apiSlice } from '../../app/api/apiSlice';
import { Teacher, CreateTeacherDto, UpdateTeacherDto } from '../../types';

export const teachersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<Teacher[], void>({
      query: () => '/api/teachers',
      providesTags: ['Teacher'],
    }),
    getTeacherById: builder.query<Teacher, number>({
      query: (id) => `/api/teachers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Teacher', id }],
    }),
    createTeacher: builder.mutation<Teacher, CreateTeacherDto>({
      query: (data) => ({ url: '/api/teachers', method: 'POST', body: data }),
      invalidatesTags: ['Teacher'],
    }),
    updateTeacher: builder.mutation<Teacher, { id: number; data: UpdateTeacherDto }>({
      query: ({ id, data }) => ({ url: `/api/teachers/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Teacher', id }, 'Teacher'],
    }),
    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/teachers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Teacher'],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teachersApi;
