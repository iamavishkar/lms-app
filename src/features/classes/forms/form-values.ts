import type { CreateClassDto } from "../../../types";

export const classFormInitialValues: CreateClassDto & { teacherId?: number } = {
  name: "",
  section: "",
  academicYear: "",
  teacherId: undefined,
};
