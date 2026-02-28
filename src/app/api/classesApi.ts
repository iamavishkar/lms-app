import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Class, CreateClassDto } from "../../interfaces";

export const classesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<Class[], void>({
      query: () => API_ENDPOINTS.CLASSES.BASE,
      providesTags: ["Class"],
    }),

    getClassById: builder.query<Class, number>({
      query: (id) => API_ENDPOINTS.CLASSES.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Class", id }],
    }),

    saveClass: builder.mutation<
      Class,
      { id?: number; data: CreateClassDto | Partial<CreateClassDto> }
    >({
      query: ({ id, data }) => ({
        url: id ? API_ENDPOINTS.CLASSES.BY_ID(id) : API_ENDPOINTS.CLASSES.BASE,
        method: id ? "PUT" : "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => (id ? [{ type: "Class", id }, "Class"] : ["Class"]),
    }),

    deleteClass: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.CLASSES.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useSaveClassMutation,
  useDeleteClassMutation,
} = classesApi;
