export const PERMISSIONS = {
  STUDENT: {
    VIEW_OWN_ATTENDANCE: true,
    VIEW_OWN_RESULTS: true,
  },
  TEACHER: {
    MARK_ATTENDANCE: true,
    CREATE_EXAM: true,
    ADD_RESULT: true,
  },
  PARENT: {
    VIEW_CHILD_ATTENDANCE: true,
    VIEW_CHILD_RESULTS: true,
  },
  COORDINATOR: {
    MANAGE_TERMS: true,
    ENROLL_STUDENTS: true,
  },
} as const;

type PermissionMap = typeof PERMISSIONS;
type RoleKey = keyof PermissionMap;
type RolePermissions<R extends RoleKey> = keyof (typeof PERMISSIONS)[R];

/** All valid permission keys across all roles */
export type PermissionKey = {
  [R in RoleKey]: RolePermissions<R>;
}[RoleKey];

export const hasPermission = (role: string, permission: PermissionKey): boolean => {
  const roleKey = role.toUpperCase() as RoleKey;
  const rolePerms = PERMISSIONS[roleKey] as Record<string, boolean> | undefined;
  return rolePerms?.[permission] ?? false;
};
