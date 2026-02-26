import { UserRole, AttendanceStatusEnum, ExamTypeEnum, GenderEnum } from "../types/enums";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const APP_TITLE =
  import.meta.env.VITE_APP_TITLE || "LMS - Learning Management System";

export const TOKEN_KEY = "lms_token";
export const USER_KEY = "lms_user";

// Re-export enum values as plain objects for backward compatibility
export const ROLES = UserRole;

export const ATTENDANCE_STATUS = AttendanceStatusEnum;

export const EXAM_TYPES = Object.values(ExamTypeEnum);

export const GENDERS = Object.values(GenderEnum);
