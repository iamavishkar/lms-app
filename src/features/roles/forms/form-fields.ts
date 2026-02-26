import type { FormFieldDef } from "../../../components/common/FormRenderer";

export const roleFormFields: FormFieldDef[] = [
  { name: "name", label: "Role Name", type: "text", required: true, gridMd: 6 },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    gridMd: 12,
    rows: 3,
  },
];
