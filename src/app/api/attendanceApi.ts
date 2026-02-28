import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { Attendance, CreateAttendanceDto, MarkAttendanceDto } from "../../interfaces";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<Attendance[], void>({
      query: () => API_ENDPOINTS.ATTENDANCE.BASE,
      providesTags: ["Attendance"],
    }),

    getAttendanceById: builder.query<Attendance, number>({
      query: (id) => API_ENDPOINTS.ATTENDANCE.BY_ID(id),
      providesTags: (_r, _e, id) => [{ type: "Attendance", id }],
    }),

    saveAttendance: builder.mutation<Attendance, { id?: number; data: CreateAttendanceDto }>({
      query: ({ id, data }) => ({
        url: id ? API_ENDPOINTS.ATTENDANCE.BY_ID(id) : API_ENDPOINTS.ATTENDANCE.BASE,
        method: id ? "PUT" : "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    markAttendance: builder.mutation<Attendance[], MarkAttendanceDto>({
      query: (data) => ({
        url: API_ENDPOINTS.ATTENDANCE.MARK,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    deleteAttendance: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.ATTENDANCE.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useGetAttendanceByIdQuery,
  useSaveAttendanceMutation,
  useMarkAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
