import { apiSlice } from '../../app/api/apiSlice';
import { Attendance, CreateAttendanceDto, MarkAttendanceDto } from '../../types';

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<Attendance[], void>({
      query: () => '/api/attendance',
      providesTags: ['Attendance'],
    }),
    getAttendanceById: builder.query<Attendance, number>({
      query: (id) => `/api/attendance/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Attendance', id }],
    }),
    createAttendance: builder.mutation<Attendance, CreateAttendanceDto>({
      query: (data) => ({ url: '/api/attendance', method: 'POST', body: data }),
      invalidatesTags: ['Attendance'],
    }),
    markAttendance: builder.mutation<Attendance[], MarkAttendanceDto>({
      query: (data) => ({ url: '/api/attendance/mark', method: 'POST', body: data }),
      invalidatesTags: ['Attendance'],
    }),
    updateAttendance: builder.mutation<Attendance, { id: number; data: Partial<CreateAttendanceDto> }>({
      query: ({ id, data }) => ({ url: `/api/attendance/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Attendance'],
    }),
    deleteAttendance: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/attendance/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useGetAttendanceByIdQuery,
  useCreateAttendanceMutation,
  useMarkAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
