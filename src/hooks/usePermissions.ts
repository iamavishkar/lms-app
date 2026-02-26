import { useAuth } from "./useAuth";
import { UserRole } from "../types/enums";

export const usePermissions = () => {
  const { user } = useAuth();
  const roleName = user?.role?.name?.toLowerCase() as UserRole | undefined;

  return {
    isAdmin: roleName === UserRole.ADMIN,
    isTeacher: roleName === UserRole.TEACHER,
    isStudent: roleName === UserRole.STUDENT,
    isParent: roleName === UserRole.PARENT,
    canManageUsers: roleName === UserRole.ADMIN,
    canManageStudents:
      roleName === UserRole.ADMIN || roleName === UserRole.TEACHER,
    canMarkAttendance:
      roleName === UserRole.ADMIN || roleName === UserRole.TEACHER,
    canManageExams:
      roleName === UserRole.ADMIN || roleName === UserRole.TEACHER,
    canManageResults:
      roleName === UserRole.ADMIN || roleName === UserRole.TEACHER,
    roleName,
  };
};
