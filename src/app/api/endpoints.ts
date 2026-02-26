// Centralized API endpoint definitions
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    PROFILE: "/api/auth/profile",
  },
  USERS: {
    BASE: "/api/users",
    BY_ID: (id: number) => `/api/users/${id}`,
  },
  ROLES: {
    BASE: "/api/roles",
    BY_ID: (id: number) => `/api/roles/${id}`,
  },
  STUDENTS: {
    BASE: "/api/students",
    BY_ID: (id: number) => `/api/students/${id}`,
    ATTENDANCE: (id: number) => `/api/attendance/student/${id}`,
    RESULTS: (id: number) => `/api/results/student/${id}`,
  },
  TEACHERS: {
    BASE: "/api/teachers",
    BY_ID: (id: number) => `/api/teachers/${id}`,
  },
  PARENTS: {
    BASE: "/api/parents",
    BY_ID: (id: number) => `/api/parents/${id}`,
  },
  CLASSES: {
    BASE: "/api/classes",
    BY_ID: (id: number) => `/api/classes/${id}`,
  },
  SUBJECTS: {
    BASE: "/api/subjects",
    BY_ID: (id: number) => `/api/subjects/${id}`,
  },
  ATTENDANCE: {
    BASE: "/api/attendance",
    BY_ID: (id: number) => `/api/attendance/${id}`,
    MARK: "/api/attendance/mark",
    BY_STUDENT: (id: number) => `/api/attendance/student/${id}`,
  },
  EXAMS: {
    BASE: "/api/exams",
    BY_ID: (id: number) => `/api/exams/${id}`,
  },
  RESULTS: {
    BASE: "/api/results",
    BY_ID: (id: number) => `/api/results/${id}`,
    BY_STUDENT: (id: number) => `/api/results/student/${id}`,
  },
  FILES: {
    UPLOAD: "/api/files/upload",
  },
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
  },
} as const;
