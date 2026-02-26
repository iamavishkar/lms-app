import type { Subject } from "./subject";
import type { Class } from "./class";

export interface Exam {
  id: number;
  name: string;
  type: string;
  date: string;
  duration: number;
  totalMarks: number;
  subject: Subject;
  class: Class;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamDto {
  name: string;
  type: string;
  date: string;
  duration: number;
  totalMarks: number;
  subjectId: number;
  classId: number;
}

export interface UpdateExamDto extends Partial<CreateExamDto> {}
