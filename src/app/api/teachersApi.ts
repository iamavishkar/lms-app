import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Teacher, CreateTeacherDto } from "../../interfaces";

export const teachersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<Teacher[], void>({
      query: () => API_ENDPOINTS.TEACHERS.BASE,
      providesTags: ["Teacher"],
    }),

    getTeacherById: builder.query<Teacher, number>({
      query: (id) => API_ENDPOINTS.TEACHERS.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Teacher", id }],
    }),

    saveTeacher: builder.mutation<
      Teacher,
      { id?: number; data: CreateTeacherDto | Partial<CreateTeacherDto> }
    >({
      query: ({ id, data }) => ({
        url: id
          ? API_ENDPOINTS.TEACHERS.BY_ID(id)
          : API_ENDPOINTS.TEACHERS.BASE,
        method: id ? "PUT" : "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) =>
        id ? [{ type: "Teacher", id }, "Teacher"] : ["Teacher"],
    }),

    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.TEACHERS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useSaveTeacherMutation,
  useDeleteTeacherMutation,
} = teachersApi;
