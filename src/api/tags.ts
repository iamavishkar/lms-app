// Centralized RTK Query cache tag definitions
export const API_TAGS = [
  "User",
  "Role",
  "Student",
  "Teacher",
  "Parent",
  "Class",
  "Subject",
  "Attendance",
  "Exam",
  "Result",
  "Dashboard",
] as const;

export type ApiTag = (typeof API_TAGS)[number];
