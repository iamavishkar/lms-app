import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Role, CreateRoleDto } from "../../interfaces";

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => API_ENDPOINTS.ROLES.BASE,
      providesTags: ["Role"],
    }),

    getRoleById: builder.query<Role, number>({
      query: (id) => API_ENDPOINTS.ROLES.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Role", id }],
    }),

    saveRole: builder.mutation<Role, { id?: number; data: CreateRoleDto | Partial<CreateRoleDto> }>(
      {
        query: ({ id, data }) => ({
          url: id ? API_ENDPOINTS.ROLES.BY_ID(id) : API_ENDPOINTS.ROLES.BASE,
          method: id ? "PUT" : "POST",
          body: data,
        }),
        invalidatesTags: (_r, _e, { id }) => (id ? [{ type: "Role", id }, "Role"] : ["Role"]),
      }
    ),

    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.ROLES.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const { useGetRolesQuery, useGetRoleByIdQuery, useSaveRoleMutation, useDeleteRoleMutation } =
  rolesApi;
