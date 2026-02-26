import { apiSlice } from '../../app/api/apiSlice';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../types';

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => '/api/students',
      providesTags: ['Student'],
    }),
    getStudentById: builder.query<Student, number>({
      query: (id) => `/api/students/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation<Student, CreateStudentDto>({
      query: (data) => ({ url: '/api/students', method: 'POST', body: data }),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation<Student, { id: number; data: UpdateStudentDto }>({
      query: ({ id, data }) => ({ url: `/api/students/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/students/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Student'],
    }),
    getStudentAttendance: builder.query<unknown[], number>({
      query: (id) => `/api/attendance/student/${id}`,
      providesTags: ['Attendance'],
    }),
    getStudentResults: builder.query<unknown[], number>({
      query: (id) => `/api/results/student/${id}`,
      providesTags: ['Result'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentAttendanceQuery,
  useGetStudentResultsQuery,
} = studentsApi;
