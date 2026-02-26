/**
 * Central form initial values for all forms in the app.
 * For edit forms, use the getter functions which accept the entity
 * and return mapped form values (handling nested fields like user.id → userId).
 */
import type {
  User,
  Role,
  Student,
  Teacher,
  Parent,
  Class,
  Subject,
  Exam,
  Result,
} from "../interfaces";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginInitialValues = {
  email: "",
  password: "",
};

export const registerInitialValues = {
  name: "",
  email: "",
  password: "",
  roleId: undefined as number | undefined,
};

// ─── User ────────────────────────────────────────────────────────────────────

export const userInitialValues = {
  name: "",
  email: "",
  password: "",
  roleId: undefined as number | undefined,
  isActive: true,
};

export const getUserFormValues = (user?: User) =>
  user
    ? {
        name: user.name,
        email: user.email,
        password: "",
        roleId: user.role?.id,
        isActive: user.isActive,
      }
    : userInitialValues;

// ─── Role ────────────────────────────────────────────────────────────────────

export const roleInitialValues = {
  name: "",
  description: "",
};

export const getRoleFormValues = (role?: Role) =>
  role ? { name: role.name, description: role.description ?? "" } : roleInitialValues;

// ─── Student ─────────────────────────────────────────────────────────────────

export const studentInitialValues = {
  enrollmentNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  phone: "",
  userId: undefined as number | undefined,
  classId: undefined as number | undefined,
  parentId: undefined as number | undefined,
};

export const getStudentFormValues = (student?: Student) =>
  student
    ? {
        enrollmentNumber: student.enrollmentNumber,
        dateOfBirth: student.dateOfBirth?.split("T")[0] ?? "",
        gender: student.gender,
        address: student.address ?? "",
        phone: student.phone ?? "",
        userId: student.user?.id,
        classId: student.class?.id,
        parentId: student.parent?.id,
      }
    : studentInitialValues;

// ─── Teacher ─────────────────────────────────────────────────────────────────

export const teacherInitialValues = {
  employeeId: "",
  qualification: "",
  specialization: "",
  phone: "",
  address: "",
  userId: undefined as number | undefined,
};

export const getTeacherFormValues = (teacher?: Teacher) =>
  teacher
    ? {
        employeeId: teacher.employeeId,
        qualification: teacher.qualification ?? "",
        specialization: teacher.specialization ?? "",
        phone: teacher.phone ?? "",
        address: teacher.address ?? "",
        userId: teacher.user?.id,
      }
    : teacherInitialValues;

// ─── Parent ──────────────────────────────────────────────────────────────────

export const parentInitialValues = {
  phone: "",
  address: "",
  occupation: "",
  userId: undefined as number | undefined,
};

export const getParentFormValues = (parent?: Parent) =>
  parent
    ? {
        phone: parent.phone ?? "",
        address: parent.address ?? "",
        occupation: parent.occupation ?? "",
        userId: parent.user?.id,
      }
    : parentInitialValues;

// ─── Class ───────────────────────────────────────────────────────────────────

export const classInitialValues = {
  name: "",
  section: "",
  academicYear: "",
  teacherId: undefined as number | undefined,
};

export const getClassFormValues = (cls?: Class) =>
  cls
    ? {
        name: cls.name,
        section: cls.section ?? "",
        academicYear: cls.academicYear,
        teacherId: cls.teacher?.id,
      }
    : classInitialValues;

// ─── Subject ─────────────────────────────────────────────────────────────────

export const subjectInitialValues = {
  name: "",
  code: "",
  description: "",
};

export const getSubjectFormValues = (subject?: Subject) =>
  subject
    ? {
        name: subject.name,
        code: subject.code,
        description: subject.description ?? "",
      }
    : subjectInitialValues;

// ─── Exam ────────────────────────────────────────────────────────────────────

export const examInitialValues = {
  name: "",
  type: "",
  date: "",
  duration: 60,
  totalMarks: 100,
  subjectId: undefined as number | undefined,
  classId: undefined as number | undefined,
};

export const getExamFormValues = (exam?: Exam) =>
  exam
    ? {
        name: exam.name,
        type: exam.type,
        date: exam.date?.split("T")[0] ?? "",
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        subjectId: exam.subject?.id,
        classId: exam.class?.id,
      }
    : examInitialValues;

// ─── Result ──────────────────────────────────────────────────────────────────

export const resultInitialValues = {
  marksObtained: 0,
  grade: "",
  remarks: "",
  studentId: undefined as number | undefined,
  examId: undefined as number | undefined,
};

export const getResultFormValues = (result?: Result) =>
  result
    ? {
        marksObtained: result.marksObtained,
        grade: result.grade ?? "",
        remarks: result.remarks ?? "",
        studentId: result.student?.id,
        examId: result.exam?.id,
      }
    : resultInitialValues;
