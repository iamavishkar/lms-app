// Centralized API endpoint definitions
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: number) => `/users/${id}`,
  },
  ROLES: {
    BASE: "/roles",
    BY_ID: (id: number) => `/roles/${id}`,
  },
  STUDENTS: {
    BASE: "/students",
    BY_ID: (id: number) => `/students/${id}`,
    ATTENDANCE: (id: number) => `/attendance/student/${id}`,
    RESULTS: (id: number) => `/results/student/${id}`,
    ME: {
      COURSES: "/students/me/courses",
      COURSE_ATTENDANCE: (courseId: number) => `/students/me/courses/${courseId}/attendance`,
      RESULTS: "/students/me/results",
    },
  },
  TEACHERS: {
    BASE: "/teachers",
    BY_ID: (id: number) => `/teachers/${id}`,
    ME: {
      COURSES: "/teachers/me/courses",
    },
  },
  PARENTS: {
    BASE: "/parents",
    BY_ID: (id: number) => `/parents/${id}`,
    ME: {
      CHILDREN: "/parents/me/children",
    },
  },
  CLASSES: {
    BASE: "/classes",
    BY_ID: (id: number) => `/classes/${id}`,
  },
  SUBJECTS: {
    BASE: "/subjects",
    BY_ID: (id: number) => `/subjects/${id}`,
  },
  ATTENDANCE: {
    BASE: "/attendance",
    BY_ID: (id: number) => `/attendance/${id}`,
    MARK: "/attendance/mark",
    BY_STUDENT: (id: number) => `/attendance/student/${id}`,
  },
  EXAMS: {
    BASE: "/exams",
    BY_ID: (id: number) => `/exams/${id}`,
  },
  RESULTS: {
    BASE: "/results",
    BY_ID: (id: number) => `/results/${id}`,
    BY_STUDENT: (id: number) => `/results/student/${id}`,
  },
  FILES: {
    UPLOAD: "/files/upload",
  },
  DASHBOARD: {
    STATS: "/dashboard/stats",
  },
} as const;
