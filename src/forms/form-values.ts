import type { Role } from "../interfaces/role";
import type { User } from "../interfaces/user";
import type { Student } from "../interfaces/student";
import type { Teacher } from "../interfaces/teacher";
import type { Parent } from "../interfaces/parent";
import type { Class } from "../interfaces/class";
import type { Subject } from "../interfaces/subject";
import type { Exam } from "../interfaces/exam";
import type { Result } from "../interfaces/result";
import type { LoginCredentials, RegisterData } from "../interfaces/auth";
import type { Attendance } from "../interfaces/attendance";

type UserFormValues = Omit<User, "role"> & { password: string; roleId?: number };
type StudentFormValues = Omit<Student, "user" | "class" | "parent"> & {
  userId?: number;
  classId?: number;
  parentId?: number;
};
type TeacherFormValues = Omit<Teacher, "user" | "subjects"> & { userId?: number };
type ParentFormValues = Omit<Parent, "user" | "students"> & { userId?: number };
type ClassFormValues = Omit<Class, "teacher" | "students" | "subjects"> & { teacherId?: number };
type ExamFormValues = Omit<Exam, "subject" | "class"> & { subjectId?: number; classId?: number };
type ResultFormValues = Omit<Result, "student" | "exam"> & { studentId?: number; examId?: number };
type AttendanceFormValues = Omit<Attendance, "student" | "class" | "markedBy"> & {
  studentId?: number;
  classId?: number;
};

export const loginInitialValues: LoginCredentials = {
  email: "",
  password: "",
};

export const registerInitialValues: RegisterData = {
  name: "",
  email: "",
  password: "",
  roleId: undefined,
};

export const userInitialValues: UserFormValues = {
  id: 0,
  name: "",
  email: "",
  password: "",
  roleId: undefined,
  isActive: true,
  createdAt: "",
  updatedAt: "",
};

export const roleInitialValues: Role = {
  id: 0,
  name: "",
  description: "",
  createdAt: "",
  updatedAt: "",
};

export const studentInitialValues: StudentFormValues = {
  id: 0,
  enrollmentNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  phone: "",
  userId: undefined,
  classId: undefined,
  parentId: undefined,
  createdAt: "",
  updatedAt: "",
};

export const teacherInitialValues: TeacherFormValues = {
  id: 0,
  employeeId: "",
  qualification: "",
  specialization: "",
  phone: "",
  address: "",
  userId: undefined,
  createdAt: "",
  updatedAt: "",
};

export const parentInitialValues: ParentFormValues = {
  id: 0,
  phone: "",
  address: "",
  occupation: "",
  userId: undefined,
  createdAt: "",
  updatedAt: "",
};

export const classInitialValues: ClassFormValues = {
  id: 0,
  name: "",
  section: "",
  academicYear: "",
  teacherId: undefined,
  createdAt: "",
  updatedAt: "",
};

export const subjectInitialValues: Omit<Subject, "classes" | "teachers"> = {
  id: 0,
  name: "",
  code: "",
  description: "",
  createdAt: "",
  updatedAt: "",
};

export const examInitialValues: ExamFormValues = {
  id: 0,
  name: "",
  type: "",
  date: "",
  duration: 60,
  totalMarks: 100,
  subjectId: undefined,
  classId: undefined,
  createdAt: "",
  updatedAt: "",
};

export const resultInitialValues: ResultFormValues = {
  id: 0,
  marksObtained: 0,
  grade: "",
  remarks: "",
  studentId: undefined,
  examId: undefined,
  createdAt: "",
  updatedAt: "",
};

export const attendanceInitialValues: AttendanceFormValues = {
  id: 0,
  date: "",
  status: "present",
  studentId: undefined,
  classId: undefined,
  createdAt: "",
  updatedAt: "",
};
