// Centralized route path constants
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",
  DASHBOARD: "/dashboard",

  USERS: {
    LIST: "/users",
    NEW: "/users/new",
    DETAIL: (id: string | number = ":id") => `/users/${id}`,
    EDIT: (id: string | number = ":id") => `/users/${id}/edit`,
  },

  ROLES: {
    LIST: "/roles",
    NEW: "/roles/new",
    EDIT: (id: string | number = ":id") => `/roles/${id}/edit`,
  },

  STUDENTS: {
    LIST: "/students",
    NEW: "/students/new",
    DETAIL: (id: string | number = ":id") => `/students/${id}`,
    EDIT: (id: string | number = ":id") => `/students/${id}/edit`,
    ATTENDANCE: (id: string | number = ":id") => `/students/${id}/attendance`,
    RESULTS: (id: string | number = ":id") => `/students/${id}/results`,
  },

  TEACHERS: {
    LIST: "/teachers",
    NEW: "/teachers/new",
    DETAIL: (id: string | number = ":id") => `/teachers/${id}`,
    EDIT: (id: string | number = ":id") => `/teachers/${id}/edit`,
  },

  PARENTS: {
    LIST: "/parents",
    NEW: "/parents/new",
    DETAIL: (id: string | number = ":id") => `/parents/${id}`,
    EDIT: (id: string | number = ":id") => `/parents/${id}/edit`,
  },

  CLASSES: {
    LIST: "/classes",
    NEW: "/classes/new",
    DETAIL: (id: string | number = ":id") => `/classes/${id}`,
    EDIT: (id: string | number = ":id") => `/classes/${id}/edit`,
    STUDENTS: (id: string | number = ":id") => `/classes/${id}/students`,
  },

  SUBJECTS: {
    LIST: "/subjects",
    NEW: "/subjects/new",
    DETAIL: (id: string | number = ":id") => `/subjects/${id}`,
    EDIT: (id: string | number = ":id") => `/subjects/${id}/edit`,
  },

  ATTENDANCE: {
    LIST: "/attendance",
    MARK: "/attendance/mark",
    REPORTS: "/attendance/reports",
  },

  EXAMS: {
    LIST: "/exams",
    NEW: "/exams/new",
    DETAIL: (id: string | number = ":id") => `/exams/${id}`,
    EDIT: (id: string | number = ":id") => `/exams/${id}/edit`,
  },

  RESULTS: {
    LIST: "/results",
    NEW: "/results/new",
    DETAIL: (id: string | number = ":id") => `/results/${id}`,
    EDIT: (id: string | number = ":id") => `/results/${id}/edit`,
    REPORTS: "/results/reports",
  },

  FILES: {
    LIST: "/files",
    UPLOAD: "/files/upload",
  },
} as const;
