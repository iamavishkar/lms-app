import { apiSlice } from '../../app/api/apiSlice';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../../types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/api/auth/profile',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi;
