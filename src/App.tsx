import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ROUTES } from "./routes/routes";

// Auth pages
const Login = lazy(() => import("./features/auth/Login"));
const Register = lazy(() => import("./features/auth/Register"));

// Dashboard
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));

// Users
const UserList = lazy(() => import("./features/users/UserList"));
const UserForm = lazy(() => import("./features/users/UserForm"));
const UserDetail = lazy(() => import("./features/users/UserDetail"));

// Roles
const RoleList = lazy(() => import("./features/roles/RoleList"));
const RoleForm = lazy(() => import("./features/roles/RoleForm"));

// Students
const StudentList = lazy(() => import("./features/students/StudentList"));
const StudentForm = lazy(() => import("./features/students/StudentForm"));
const StudentDetail = lazy(() => import("./features/students/StudentDetail"));

// Teachers
const TeacherList = lazy(() => import("./features/teachers/TeacherList"));
const TeacherForm = lazy(() => import("./features/teachers/TeacherForm"));
const TeacherDetail = lazy(() => import("./features/teachers/TeacherDetail"));

// Parents
const ParentList = lazy(() => import("./features/parents/ParentList"));
const ParentForm = lazy(() => import("./features/parents/ParentForm"));

// Classes
const ClassList = lazy(() => import("./features/classes/ClassList"));
const ClassForm = lazy(() => import("./features/classes/ClassForm"));
const ClassDetail = lazy(() => import("./features/classes/ClassDetail"));

// Subjects
const SubjectList = lazy(() => import("./features/subjects/SubjectList"));
const SubjectForm = lazy(() => import("./features/subjects/SubjectForm"));

// Attendance
const AttendanceList = lazy(
  () => import("./features/attendance/AttendanceList")
);
const MarkAttendance = lazy(
  () => import("./features/attendance/MarkAttendance")
);
const AttendanceReport = lazy(
  () => import("./features/attendance/AttendanceReport")
);

// Exams
const ExamList = lazy(() => import("./features/exams/ExamList"));
const ExamForm = lazy(() => import("./features/exams/ExamForm"));
const ExamDetail = lazy(() => import("./features/exams/ExamDetail"));

// Results
const ResultList = lazy(() => import("./features/results/ResultList"));
const ResultForm = lazy(() => import("./features/results/ResultForm"));

// Files
const FileUpload = lazy(() => import("./features/files/FileUpload"));

const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Protected routes wrapped in DashboardLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />

          {/* Users */}
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/:id/edit" element={<UserForm />} />

          {/* Roles */}
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/new" element={<RoleForm />} />
          <Route path="roles/:id/edit" element={<RoleForm />} />

          {/* Students */}
          <Route path="students" element={<StudentList />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="students/:id/edit" element={<StudentForm />} />

          {/* Teachers */}
          <Route path="teachers" element={<TeacherList />} />
          <Route path="teachers/new" element={<TeacherForm />} />
          <Route path="teachers/:id" element={<TeacherDetail />} />
          <Route path="teachers/:id/edit" element={<TeacherForm />} />

          {/* Parents */}
          <Route path="parents" element={<ParentList />} />
          <Route path="parents/new" element={<ParentForm />} />
          <Route path="parents/:id/edit" element={<ParentForm />} />

          {/* Classes */}
          <Route path="classes" element={<ClassList />} />
          <Route path="classes/new" element={<ClassForm />} />
          <Route path="classes/:id" element={<ClassDetail />} />
          <Route path="classes/:id/edit" element={<ClassForm />} />

          {/* Subjects */}
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/new" element={<SubjectForm />} />
          <Route path="subjects/:id/edit" element={<SubjectForm />} />

          {/* Attendance */}
          <Route path="attendance" element={<AttendanceList />} />
          <Route path="attendance/mark" element={<MarkAttendance />} />
          <Route path="attendance/reports" element={<AttendanceReport />} />

          {/* Exams */}
          <Route path="exams" element={<ExamList />} />
          <Route path="exams/new" element={<ExamForm />} />
          <Route path="exams/:id" element={<ExamDetail />} />
          <Route path="exams/:id/edit" element={<ExamForm />} />

          {/* Results */}
          <Route path="results" element={<ResultList />} />
          <Route path="results/new" element={<ResultForm />} />
          <Route path="results/:id/edit" element={<ResultForm />} />

          {/* Files */}
          <Route path="files" element={<FileUpload />} />
          <Route path="files/upload" element={<FileUpload />} />
        </Route>

        {/* Unauthorized */}
        <Route
          path={ROUTES.UNAUTHORIZED}
          element={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
            >
              <Box textAlign="center">
                <Typography variant="h4" gutterBottom>
                  403 — Unauthorized
                </Typography>
                <Typography color="text.secondary">
                  You do not have permission to access this page.
                </Typography>
              </Box>
            </Box>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
            >
              <Box textAlign="center">
                <Typography variant="h4" gutterBottom>
                  404 — Page Not Found
                </Typography>
                <Typography color="text.secondary">
                  The page you are looking for does not exist.
                </Typography>
              </Box>
            </Box>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
