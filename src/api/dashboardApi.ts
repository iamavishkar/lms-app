import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "./endpoints";
import type { DashboardStats } from "../types";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => API_ENDPOINTS.DASHBOARD.STATS,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
