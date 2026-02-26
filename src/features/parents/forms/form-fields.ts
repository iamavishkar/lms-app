import type { FormFieldDef } from "../../../components/common/FormRenderer";

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
  { name: "address", label: "Address", type: "textarea", gridMd: 12, rows: 2 },
];
