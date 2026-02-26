import { apiSlice } from '../../app/api/apiSlice';
import { User, CreateUserDto, UpdateUserDto } from '../../types';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/api/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/api/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, CreateUserDto>({
      query: (data) => ({ url: '/api/users', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: number; data: UpdateUserDto }>({
      query: ({ id, data }) => ({ url: `/api/users/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
