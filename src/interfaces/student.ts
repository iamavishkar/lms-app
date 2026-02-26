import type { User } from "./user";
import type { Class } from "./class";
import type { Parent } from "./parent";

export interface Student {
  id: number;
  enrollmentNumber: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  phone?: string;
  photo?: string;
  user: User;
  class?: Class;
  parent?: Parent;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  enrollmentNumber: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  phone?: string;
  userId: number;
  classId?: number;
  parentId?: number;
}
