import type { FormFieldDef } from "../../../components/common/FormRenderer";

export const subjectFormFields: FormFieldDef[] = [
  { name: "name", label: "Subject Name", type: "text", required: true, gridMd: 5 },
  { name: "code", label: "Subject Code", type: "text", required: true, gridMd: 3 },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    gridMd: 12,
    rows: 3,
  },
];
