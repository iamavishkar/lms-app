import type { FormFieldDef } from "../../../components/common/FormRenderer";

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
