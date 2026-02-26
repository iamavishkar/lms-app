import type { Teacher } from "./teacher";
import type { Subject } from "./subject";

// Forward reference to avoid circular import
interface StudentRef {
  id: number;
  enrollmentNumber: string;
  gender?: string;
  user: { id: number; name: string; email: string };
}

export interface Class {
  id: number;
  name: string;
  section?: string;
  academicYear: string;
  teacher?: Teacher;
  students?: StudentRef[];
  subjects?: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  name: string;
  section?: string;
  academicYear: string;
  teacherId?: number;
}

