import { apiSlice } from '../../app/api/apiSlice';
import { Class, CreateClassDto, UpdateClassDto } from '../../types';

export const classesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<Class[], void>({
      query: () => '/api/classes',
      providesTags: ['Class'],
    }),
    getClassById: builder.query<Class, number>({
      query: (id) => `/api/classes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Class', id }],
    }),
    createClass: builder.mutation<Class, CreateClassDto>({
      query: (data) => ({ url: '/api/classes', method: 'POST', body: data }),
      invalidatesTags: ['Class'],
    }),
    updateClass: builder.mutation<Class, { id: number; data: UpdateClassDto }>({
      query: ({ id, data }) => ({ url: `/api/classes/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Class', id }, 'Class'],
    }),
    deleteClass: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/classes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Class'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classesApi;
