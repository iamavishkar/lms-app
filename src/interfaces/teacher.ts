import type { User } from "./user";
import type { Subject } from "./subject";

export interface Teacher {
  id: number;
  employeeId: string;
  qualification?: string;
  specialization?: string;
  phone?: string;
  address?: string;
  user: User;
  subjects?: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherDto {
  employeeId: string;
  qualification?: string;
  specialization?: string;
  phone?: string;
  address?: string;
  userId: number;
}

export interface UpdateTeacherDto extends Partial<CreateTeacherDto> {}
