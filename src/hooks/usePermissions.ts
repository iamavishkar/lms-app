import { useAuth } from './useAuth';
import { ROLES } from '../utils/constants';

export const usePermissions = () => {
  const { user } = useAuth();
  const roleName = user?.role?.name?.toLowerCase();

  return {
    isAdmin: roleName === ROLES.ADMIN,
    isTeacher: roleName === ROLES.TEACHER,
    isStudent: roleName === ROLES.STUDENT,
    isParent: roleName === ROLES.PARENT,
    canManageUsers: roleName === ROLES.ADMIN,
    canManageStudents: roleName === ROLES.ADMIN || roleName === ROLES.TEACHER,
    canMarkAttendance: roleName === ROLES.ADMIN || roleName === ROLES.TEACHER,
    canManageExams: roleName === ROLES.ADMIN || roleName === ROLES.TEACHER,
    canManageResults: roleName === ROLES.ADMIN || roleName === ROLES.TEACHER,
    roleName,
  };
};
