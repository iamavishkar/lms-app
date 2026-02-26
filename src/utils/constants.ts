export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'LMS - Learning Management System';

export const TOKEN_KEY = 'lms_token';
export const USER_KEY = 'lms_user';

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
} as const;

export const EXAM_TYPES = ['Unit Test', 'Mid Term', 'Final', 'Assignment', 'Quiz'];

export const GENDERS = ['Male', 'Female', 'Other'];
