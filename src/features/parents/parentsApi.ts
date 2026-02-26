import { apiSlice } from '../../app/api/apiSlice';
import { Parent, CreateParentDto, UpdateParentDto } from '../../types';

export const parentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParents: builder.query<Parent[], void>({
      query: () => '/api/parents',
      providesTags: ['Parent'],
    }),
    getParentById: builder.query<Parent, number>({
      query: (id) => `/api/parents/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Parent', id }],
    }),
    createParent: builder.mutation<Parent, CreateParentDto>({
      query: (data) => ({ url: '/api/parents', method: 'POST', body: data }),
      invalidatesTags: ['Parent'],
    }),
    updateParent: builder.mutation<Parent, { id: number; data: UpdateParentDto }>({
      query: ({ id, data }) => ({ url: `/api/parents/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Parent', id }, 'Parent'],
    }),
    deleteParent: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/parents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Parent'],
    }),
  }),
});

export const {
  useGetParentsQuery,
  useGetParentByIdQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
} = parentsApi;
