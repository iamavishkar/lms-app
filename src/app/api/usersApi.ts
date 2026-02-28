import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { User, CreateUserDto } from "../../interfaces";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => API_ENDPOINTS.USERS.BASE,
      providesTags: ["User"],
    }),

    getUserById: builder.query<User, number>({
      query: (id) => API_ENDPOINTS.USERS.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    /** Single save mutation: creates when no id, updates when id is provided */
    saveUser: builder.mutation<User, { id?: number; data: CreateUserDto | Partial<CreateUserDto> }>(
      {
        query: ({ id, data }) => ({
          url: id ? API_ENDPOINTS.USERS.BY_ID(id) : API_ENDPOINTS.USERS.BASE,
          method: id ? "PUT" : "POST",
          body: data,
        }),
        invalidatesTags: (_r, _e, { id }) => (id ? [{ type: "User", id }, "User"] : ["User"]),
      }
    ),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useSaveUserMutation, useDeleteUserMutation } =
  usersApi;
