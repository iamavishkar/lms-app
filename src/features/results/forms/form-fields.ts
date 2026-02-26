import type { FormFieldDef } from "../../../components/common/FormRenderer";

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
  { name: "remarks", label: "Remarks", type: "textarea", gridMd: 12, rows: 2 },
];
