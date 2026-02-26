import type { CreateUserDto } from "../interfaces/user";
import type { CreateRoleDto } from "../interfaces/role";
import type { CreateStudentDto } from "../interfaces/student";
import type { CreateTeacherDto } from "../interfaces/teacher";
import type { CreateParentDto } from "../interfaces/parent";
import type { CreateClassDto } from "../interfaces/class";
import type { CreateSubjectDto } from "../interfaces/subject";
import type { CreateExamDto } from "../interfaces/exam";
import type { CreateResultDto } from "../interfaces/result";
import type { LoginCredentials, RegisterData } from "../interfaces/auth";

export const loginInitialValues: LoginCredentials = {
  email: "",
  password: "",
};

export const registerInitialValues: Omit<RegisterData, "roleId"> & {
  roleId: number | undefined;
} = {
  name: "",
  email: "",
  password: "",
  roleId: undefined,
};

export const userInitialValues: CreateUserDto & { isActive: boolean } = {
  name: "",
  email: "",
  password: "",
  roleId: 0,
  isActive: true,
};

export const roleInitialValues: CreateRoleDto = {
  name: "",
  description: "",
};

export const studentInitialValues: CreateStudentDto = {
  enrollmentNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  phone: "",
  userId: 0,
  classId: undefined,
  parentId: undefined,
};

export const teacherInitialValues: CreateTeacherDto = {
  employeeId: "",
  qualification: "",
  specialization: "",
  phone: "",
  address: "",
  userId: 0,
};

export const parentInitialValues: CreateParentDto = {
  phone: "",
  address: "",
  occupation: "",
  userId: 0,
};

export const classInitialValues: CreateClassDto = {
  name: "",
  section: "",
  academicYear: "",
  teacherId: undefined,
};

export const subjectInitialValues: CreateSubjectDto = {
  name: "",
  code: "",
  description: "",
};

export const examInitialValues: CreateExamDto = {
  name: "",
  type: "",
  date: "",
  duration: 60,
  totalMarks: 100,
  subjectId: 0,
  classId: 0,
};

export const resultInitialValues: CreateResultDto = {
  marksObtained: 0,
  grade: "",
  remarks: "",
  studentId: 0,
  examId: 0,
};
