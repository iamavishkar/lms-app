import { apiSlice } from '../../app/api/apiSlice';
import { Role, CreateRoleDto, UpdateRoleDto } from '../../types';

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/api/roles',
      providesTags: ['Role'],
    }),
    getRoleById: builder.query<Role, number>({
      query: (id) => `/api/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Role', id }],
    }),
    createRole: builder.mutation<Role, CreateRoleDto>({
      query: (data) => ({ url: '/api/roles', method: 'POST', body: data }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<Role, { id: number; data: UpdateRoleDto }>({
      query: ({ id, data }) => ({ url: `/api/roles/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Role'],
    }),
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
