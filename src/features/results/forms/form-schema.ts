import * as yup from "yup";

export const resultFormSchema = yup.object({
  marksObtained: yup
    .number()
    .min(0, "Cannot be negative")
    .required("Marks obtained is required"),
  grade: yup.string(),
  remarks: yup.string(),
  studentId: yup.number().required("Student is required"),
  examId: yup.number().required("Exam is required"),
});
