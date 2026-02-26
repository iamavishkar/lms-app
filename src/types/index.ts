// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleId: number;
  isActive?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  roleId?: number;
  isActive?: boolean;
}

// Role types
export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

// Student types
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

export interface UpdateStudentDto extends Partial<CreateStudentDto> {}

// Teacher types
export interface Teacher {
  id: number;
  employeeId: string;
  qualification?: string;
  specialization?: string;
  phone?: string;
  address?: string;
  user: User;
  classes?: Class[];
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

// Parent types
export interface Parent {
  id: number;
  phone?: string;
  address?: string;
  occupation?: string;
  user: User;
  students?: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateParentDto {
  phone?: string;
  address?: string;
  occupation?: string;
  userId: number;
}

export interface UpdateParentDto extends Partial<CreateParentDto> {}

// Class types
export interface Class {
  id: number;
  name: string;
  section?: string;
  academicYear: string;
  teacher?: Teacher;
  students?: Student[];
  subjects?: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  name: string;
  section?: string;
  academicYear: string;
  teacherId?: number;
}

export interface UpdateClassDto extends Partial<CreateClassDto> {}

// Subject types
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

export interface UpdateSubjectDto extends Partial<CreateSubjectDto> {}

// Attendance types
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Attendance {
  id: number;
  date: string;
  status: AttendanceStatus;
  student: Student;
  class: Class;
  markedBy?: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceDto {
  date: string;
  status: AttendanceStatus;
  studentId: number;
  classId: number;
}

export interface MarkAttendanceDto {
  date: string;
  classId: number;
  attendances: { studentId: number; status: AttendanceStatus }[];
}

// Exam types
export interface Exam {
  id: number;
  name: string;
  type: string;
  date: string;
  duration: number;
  totalMarks: number;
  subject: Subject;
  class: Class;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamDto {
  name: string;
  type: string;
  date: string;
  duration: number;
  totalMarks: number;
  subjectId: number;
  classId: number;
}

export interface UpdateExamDto extends Partial<CreateExamDto> {}

// Result types
export interface Result {
  id: number;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  student: Student;
  exam: Exam;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResultDto {
  marksObtained: number;
  grade?: string;
  remarks?: string;
  studentId: number;
  examId: number;
}

export interface UpdateResultDto extends Partial<CreateResultDto> {}

// Dashboard stats types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  totalSubjects: number;
  totalExams: number;
  recentAttendance?: AttendanceSummary[];
  upcomingExams?: Exam[];
}

export interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  late: number;
}

// API response types
export interface ApiError {
  status: number;
  data: {
    message: string;
    error?: string;
    statusCode?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// File types
export interface FileUploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}
