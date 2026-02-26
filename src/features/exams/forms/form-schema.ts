import * as yup from "yup";
import { ExamTypeEnum } from "../../../types/enums";

export const examFormSchema = yup.object({
  name: yup.string().required("Exam name is required"),
  type: yup
    .string()
    .oneOf(Object.values(ExamTypeEnum))
    .required("Exam type is required"),
  date: yup.string().required("Date is required"),
  duration: yup
    .number()
    .positive("Must be positive")
    .required("Duration is required"),
  totalMarks: yup
    .number()
    .positive("Must be positive")
    .required("Total marks is required"),
  subjectId: yup.number().required("Subject is required"),
  classId: yup.number().required("Class is required"),
});
