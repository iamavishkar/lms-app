import * as yup from "yup";
import { GenderEnum, ExamTypeEnum } from "../types/enums";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const createUserFormSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  roleId: yup.number().required("Role is required"),
  isActive: yup.boolean(),
});

export const updateUserFormSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string(),
  roleId: yup.number().required("Role is required"),
  isActive: yup.boolean(),
});

export const roleFormSchema = yup.object({
  name: yup.string().required("Role name is required"),
  description: yup.string(),
});

export const studentFormSchema = yup.object({
  enrollmentNumber: yup.string().required("Enrollment number is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup.string().oneOf(Object.values(GenderEnum)).required("Gender is required"),
  address: yup.string(),
  phone: yup.string(),
  userId: yup.number().required("User is required"),
  classId: yup.number().nullable(),
  parentId: yup.number().nullable(),
});

export const teacherFormSchema = yup.object({
  employeeId: yup.string().required("Employee ID is required"),
  qualification: yup.string(),
  specialization: yup.string(),
  phone: yup.string(),
  address: yup.string(),
  userId: yup.number().required("User is required"),
});

export const parentFormSchema = yup.object({
  phone: yup.string(),
  address: yup.string(),
  occupation: yup.string(),
  userId: yup.number().required("User is required"),
});

export const classFormSchema = yup.object({
  name: yup.string().required("Class name is required"),
  section: yup.string(),
  academicYear: yup
    .string()
    .required("Academic year is required")
    .matches(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY (e.g. 2024-2025)")
    .test("valid-range", "End year must be one year after start year", (value) => {
      if (!value) return true;
      const [start, end] = value.split("-").map(Number);
      return end === start + 1;
    }),
  teacherId: yup.number().nullable(),
});

export const subjectFormSchema = yup.object({
  name: yup.string().required("Subject name is required"),
  code: yup.string().required("Subject code is required"),
  description: yup.string(),
});

export const examFormSchema = yup.object({
  name: yup.string().required("Exam name is required"),
  type: yup.string().oneOf(Object.values(ExamTypeEnum)).required("Exam type is required"),
  date: yup.string().required("Date is required"),
  duration: yup.number().positive("Must be positive").required("Duration is required"),
  totalMarks: yup.number().positive("Must be positive").required("Total marks is required"),
  subjectId: yup.number().required("Subject is required"),
  classId: yup.number().required("Class is required"),
});

export const resultFormSchema = yup.object({
  marksObtained: yup.number().min(0, "Cannot be negative").required("Marks obtained is required"),
  grade: yup.string(),
  remarks: yup.string(),
  studentId: yup.number().required("Student is required"),
  examId: yup.number().required("Exam is required"),
});
