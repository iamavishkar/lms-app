import type { User } from "./user";

// Forward reference to avoid circular import
interface StudentRef {
  id: number;
  enrollmentNumber: string;
  user: { id: number; name: string; email: string };
}

export interface Parent {
  id: number;
  phone?: string;
  address?: string;
  occupation?: string;
  user: User;
  students?: StudentRef[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateParentDto {
  phone?: string;
  address?: string;
  occupation?: string;
  userId: number;
}

