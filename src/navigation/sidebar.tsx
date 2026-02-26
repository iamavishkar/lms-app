import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ClassIcon from "@mui/icons-material/Class";
import SubjectIcon from "@mui/icons-material/Subject";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import type { Navigation } from "@toolpad/core";
import { UserRole } from "../types/enums";

export interface SidebarNavItem {
  segment: string;
  title: string;
  icon: React.ReactNode;
  roles: UserRole[];
  children?: Omit<SidebarNavItem, "children">[];
}

/**
 * Full navigation definition.
 * `roles` drives visibility per-user; the sidebar component filters
 * this list before passing it to Toolpad's AppProvider.
 */
export const NAV_ITEMS: SidebarNavItem[] = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
  {
    segment: "users",
    title: "Users",
    icon: <PeopleIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    segment: "roles",
    title: "Roles",
    icon: <AdminPanelSettingsIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    segment: "students",
    title: "Students",
    icon: <SchoolIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    segment: "teachers",
    title: "Teachers",
    icon: <SupervisorAccountIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    segment: "parents",
    title: "Parents",
    icon: <FamilyRestroomIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    segment: "classes",
    title: "Classes",
    icon: <ClassIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    segment: "subjects",
    title: "Subjects",
    icon: <SubjectIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    segment: "attendance",
    title: "Attendance",
    icon: <EventNoteIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
  {
    segment: "exams",
    title: "Exams",
    icon: <AssignmentIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
  {
    segment: "results",
    title: "Results",
    icon: <AssessmentIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
  {
    segment: "files",
    title: "Files",
    icon: <CloudUploadIcon />,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
];

/**
 * Filters the NAV_ITEMS to only those visible for a given role and
 * returns a Toolpad-compatible Navigation array.
 */
export function buildNavigation(role: UserRole | undefined): Navigation {
  if (!role) return [];

  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => ({
    segment: item.segment,
    title: item.title,
    icon: item.icon,
    ...(item.children
      ? {
          children: item.children.map((child) => ({
            segment: child.segment,
            title: child.title,
            icon: child.icon,
          })),
        }
      : {}),
  }));
}
