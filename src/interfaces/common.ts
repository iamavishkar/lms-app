import type { Exam } from "./exam";

export interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  totalSubjects: number;
  totalExams: number;
  recentAttendance?: AttendanceSummary[];
  upcomingExams?: Exam[];
}

export interface ApiError {
  status: number;
  data: {
    message: string;
    error?: string;
    statusCode?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}
