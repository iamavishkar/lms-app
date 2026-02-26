import type { Student } from "./student";
import type { Exam } from "./exam";

export interface Result {
  id: number;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  student: Student;
  exam: Exam;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResultDto {
  marksObtained: number;
  grade?: string;
  remarks?: string;
  studentId: number;
  examId: number;
}

