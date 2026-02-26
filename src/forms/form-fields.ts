/**
 * Central form field definitions for all forms in the app.
 * Dynamic options (driven by API data) are injected at the component level
 * by replacing the relevant field's `options` array at render time.
 */
import type { FormFieldDef } from "../components/common/FormRenderer";
import { GenderEnum, ExamTypeEnum } from "../types/enums";

// ─── User ────────────────────────────────────────────────────────────────────

export const getUserFormFields = (isEdit: boolean): FormFieldDef[] => [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    gridMd: 6,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    gridMd: 6,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: !isEdit,
    gridMd: 6,
    hidden: isEdit,
  },
  {
    name: "roleId",
    label: "Role",
    type: "select",
    required: true,
    gridMd: 6,
    options: [], // populated dynamically
  },
  {
    name: "isActive",
    label: "Status",
    type: "select",
    gridMd: 6,
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];

// ─── Role ────────────────────────────────────────────────────────────────────

export const roleFormFields: FormFieldDef[] = [
  {
    name: "name",
    label: "Role Name",
    type: "text",
    required: true,
    gridMd: 6,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    gridMd: 12,
    rows: 3,
  },
];

// ─── Student ─────────────────────────────────────────────────────────────────

export const getStudentFormFields = (): FormFieldDef[] => [
  {
    name: "enrollmentNumber",
    label: "Enrollment Number",
    type: "text",
    required: true,
    gridMd: 4,
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    required: true,
    gridMd: 4,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    gridMd: 4,
    options: Object.values(GenderEnum).map((g) => ({ label: g, value: g })),
  },
  { name: "phone", label: "Phone", type: "text", gridMd: 4 },
  { name: "address", label: "Address", type: "textarea", gridMd: 8, rows: 2 },
  {
    name: "userId",
    label: "Linked User",
    type: "select",
    required: true,
    gridMd: 4,
    options: [], // populated dynamically
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    gridMd: 4,
    options: [], // populated dynamically
  },
  {
    name: "parentId",
    label: "Parent",
    type: "select",
    gridMd: 4,
    options: [], // populated dynamically
  },
];

// ─── Teacher ─────────────────────────────────────────────────────────────────

export const getTeacherFormFields = (): FormFieldDef[] => [
  {
    name: "employeeId",
    label: "Employee ID",
    type: "text",
    required: true,
    gridMd: 4,
  },
  { name: "qualification", label: "Qualification", type: "text", gridMd: 4 },
  { name: "specialization", label: "Specialization", type: "text", gridMd: 4 },
  { name: "phone", label: "Phone", type: "text", gridMd: 4 },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    gridMd: 8,
    rows: 2,
  },
  {
    name: "userId",
    label: "Linked User",
    type: "select",
    required: true,
    gridMd: 4,
    options: [], // populated dynamically
  },
];

// ─── Parent ──────────────────────────────────────────────────────────────────

export const getParentFormFields = (): FormFieldDef[] => [
  { name: "phone", label: "Phone", type: "text", gridMd: 4 },
  { name: "occupation", label: "Occupation", type: "text", gridMd: 4 },
  {
    name: "userId",
    label: "Linked User",
    type: "select",
    required: true,
    gridMd: 4,
    options: [], // populated dynamically
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    gridMd: 12,
    rows: 2,
  },
];

// ─── Class ───────────────────────────────────────────────────────────────────

export const classFormFields: FormFieldDef[] = [
  {
    name: "name",
    label: "Class Name",
    type: "text",
    required: true,
    gridMd: 4,
  },
  {
    name: "section",
    label: "Section",
    type: "text",
    gridMd: 4,
  },
  {
    name: "academicYear",
    label: "Academic Year",
    type: "text",
    required: true,
    placeholder: "e.g. 2024-2025",
    gridMd: 4,
  },
  {
    name: "teacherId",
    label: "Class Teacher",
    type: "select",
    gridMd: 6,
    options: [], // populated dynamically
  },
];

// ─── Subject ─────────────────────────────────────────────────────────────────

export const subjectFormFields: FormFieldDef[] = [
  {
    name: "name",
    label: "Subject Name",
    type: "text",
    required: true,
    gridMd: 5,
  },
  {
    name: "code",
    label: "Subject Code",
    type: "text",
    required: true,
    gridMd: 3,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    gridMd: 12,
    rows: 3,
  },
];

// ─── Exam ────────────────────────────────────────────────────────────────────

export const getExamFormFields = (): FormFieldDef[] => [
  {
    name: "name",
    label: "Exam Name",
    type: "text",
    required: true,
    gridMd: 6,
  },
  {
    name: "type",
    label: "Exam Type",
    type: "select",
    required: true,
    gridMd: 6,
    options: Object.values(ExamTypeEnum).map((t) => ({ label: t, value: t })),
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    required: true,
    gridMd: 4,
  },
  {
    name: "duration",
    label: "Duration (minutes)",
    type: "number",
    required: true,
    gridMd: 4,
  },
  {
    name: "totalMarks",
    label: "Total Marks",
    type: "number",
    required: true,
    gridMd: 4,
  },
  {
    name: "subjectId",
    label: "Subject",
    type: "select",
    required: true,
    gridMd: 6,
    options: [], // populated dynamically
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    required: true,
    gridMd: 6,
    options: [], // populated dynamically
  },
];

// ─── Result ──────────────────────────────────────────────────────────────────

export const getResultFormFields = (): FormFieldDef[] => [
  {
    name: "studentId",
    label: "Student",
    type: "select",
    required: true,
    gridMd: 6,
    options: [], // populated dynamically
  },
  {
    name: "examId",
    label: "Exam",
    type: "select",
    required: true,
    gridMd: 6,
    options: [], // populated dynamically
  },
  {
    name: "marksObtained",
    label: "Marks Obtained",
    type: "number",
    required: true,
    gridMd: 4,
  },
  { name: "grade", label: "Grade", type: "text", gridMd: 4 },
  {
    name: "remarks",
    label: "Remarks",
    type: "textarea",
    gridMd: 12,
    rows: 2,
  },
];
