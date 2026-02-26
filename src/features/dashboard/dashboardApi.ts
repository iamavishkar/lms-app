import { apiSlice } from '../../app/api/apiSlice';
import { DashboardStats } from '../../types';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/api/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
