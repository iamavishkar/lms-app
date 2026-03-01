import type { Role } from "./role";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
