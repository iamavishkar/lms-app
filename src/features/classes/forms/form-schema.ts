import * as yup from "yup";

export const classFormSchema = yup.object({
  name: yup.string().required("Class name is required"),
  section: yup.string(),
  academicYear: yup
    .string()
    .required("Academic year is required")
    .matches(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY (e.g. 2024-2025)"),
  teacherId: yup.number().nullable(),
});
