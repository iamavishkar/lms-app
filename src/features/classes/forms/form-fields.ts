import type { FormFieldDef } from "../../../components/common/FormRenderer";

/**
 * Static field definitions for the Class form.
 * Dynamic options (e.g. teacher list) are injected at runtime by ClassForm.tsx.
 */
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
