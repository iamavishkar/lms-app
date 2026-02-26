import type { FormFieldDef } from "../../../components/common/FormRenderer";
import { GenderEnum } from "../../../types/enums";

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
