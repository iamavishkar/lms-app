import type { FormFieldDef } from "../../../components/common/FormRenderer";
import { ExamTypeEnum } from "../../../types/enums";

export const getExamFormFields = (): FormFieldDef[] => [
  { name: "name", label: "Exam Name", type: "text", required: true, gridMd: 6 },
  {
    name: "type",
    label: "Exam Type",
    type: "select",
    required: true,
    gridMd: 6,
    options: Object.values(ExamTypeEnum).map((t) => ({ label: t, value: t })),
  },
  { name: "date", label: "Date", type: "date", required: true, gridMd: 4 },
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
