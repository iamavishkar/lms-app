import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../../interfaces";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: userData,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => API_ENDPOINTS.AUTH.PROFILE,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi;
