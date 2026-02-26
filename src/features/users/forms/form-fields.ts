import type { FormFieldDef } from "../../../components/common/FormRenderer";

export const getUserFormFields = (isEdit: boolean): FormFieldDef[] => [
  { name: "name", label: "Full Name", type: "text", required: true, gridMd: 6 },
  { name: "email", label: "Email", type: "email", required: true, gridMd: 6 },
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
