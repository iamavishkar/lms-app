import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Parent, CreateParentDto } from "../../interfaces";

export const parentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParents: builder.query<Parent[], void>({
      query: () => API_ENDPOINTS.PARENTS.BASE,
      providesTags: ["Parent"],
    }),

    getParentById: builder.query<Parent, number>({
      query: (id) => API_ENDPOINTS.PARENTS.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Parent", id }],
    }),

    saveParent: builder.mutation<
      Parent,
      { id?: number; data: CreateParentDto | Partial<CreateParentDto> }
    >({
      query: ({ id, data }) => ({
        url: id
          ? API_ENDPOINTS.PARENTS.BY_ID(id)
          : API_ENDPOINTS.PARENTS.BASE,
        method: id ? "PUT" : "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) =>
        id ? [{ type: "Parent", id }, "Parent"] : ["Parent"],
    }),

    deleteParent: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.PARENTS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Parent"],
    }),
  }),
});

export const {
  useGetParentsQuery,
  useGetParentByIdQuery,
  useSaveParentMutation,
  useDeleteParentMutation,
} = parentsApi;
