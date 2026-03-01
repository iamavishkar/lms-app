import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { API_TAGS } from "./tags";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;      
      if (token) {        
        headers.set("Authorization", `Bearer ${token}`);
      }      
      return headers;
    },
    responseHandler: async (response) => {
      if (!response.ok) {
        const data = await response.json();
        const status = response.status;
        const errorMessage = data?.error?.message;

        // Handle 401 error (token expiration)
        if (status === 401 && !errorMessage) {
          localStorage.removeItem("access_token");
          // You might want to dispatch a logout action here
        }

        throw {
          status,
          message: errorMessage || "Something went wrong",
        };
      }

      return response.json();
    },
  }),
  tagTypes: API_TAGS,
  endpoints: () => ({}),
});
