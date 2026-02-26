import type { Class } from "./class";
import type { Teacher } from "./teacher";

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  classes?: Class[];
  teachers?: Teacher[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectDto {
  name: string;
  code: string;
  description?: string;
}
