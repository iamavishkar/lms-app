import type { Student } from "./student";
import type { Class } from "./class";
import type { Teacher } from "./teacher";

export type AttendanceStatus = "present" | "absent" | "late";

export interface Attendance {
  id: number;
  date: string;
  status: AttendanceStatus;
  student: Student;
  class: Class;
  markedBy?: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceDto {
  date: string;
  status: AttendanceStatus;
  studentId: number;
  classId: number;
}

export interface MarkAttendanceDto {
  date: string;
  classId: number;
  attendances: { studentId: number; status: AttendanceStatus }[];
}
