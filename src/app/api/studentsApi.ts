import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Student, CreateStudentDto } from "../../interfaces";

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => API_ENDPOINTS.STUDENTS.BASE,
      providesTags: ["Student"],
    }),

    getStudentById: builder.query<Student, number>({
      query: (id) => API_ENDPOINTS.STUDENTS.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Student", id }],
    }),

    saveStudent: builder.mutation<
      Student,
      { id?: number; data: CreateStudentDto | Partial<CreateStudentDto> }
    >({
      query: ({ id, data }) => ({
        url: id ? API_ENDPOINTS.STUDENTS.BY_ID(id) : API_ENDPOINTS.STUDENTS.BASE,
        method: id ? "PUT" : "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) =>
        id ? [{ type: "Student", id }, "Student"] : ["Student"],
    }),

    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.STUDENTS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),

    getStudentAttendance: builder.query<unknown[], number>({
      query: (id) => API_ENDPOINTS.STUDENTS.ATTENDANCE(id),
      providesTags: ["Attendance"],
    }),

    getStudentResults: builder.query<unknown[], number>({
      query: (id) => API_ENDPOINTS.STUDENTS.RESULTS(id),
      providesTags: ["Result"],
    }),

    getMyStudentCourses: builder.query<unknown[], void>({
      query: () => API_ENDPOINTS.STUDENTS.ME.COURSES,
    }),

    getMyCourseAttendance: builder.query<unknown[], number>({
      query: (courseId) => API_ENDPOINTS.STUDENTS.ME.COURSE_ATTENDANCE(courseId),
      providesTags: ["Attendance"],
    }),

    getMyStudentResults: builder.query<unknown[], void>({
      query: () => API_ENDPOINTS.STUDENTS.ME.RESULTS,
      providesTags: ["Result"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useSaveStudentMutation,
  useDeleteStudentMutation,
  useGetStudentAttendanceQuery,
  useGetStudentResultsQuery,
  useGetMyStudentCoursesQuery,
  useGetMyCourseAttendanceQuery,
  useGetMyStudentResultsQuery,
} = studentsApi;
