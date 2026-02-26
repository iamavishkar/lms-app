import * as yup from "yup";
import { GenderEnum } from "../../../types/enums";

export const studentFormSchema = yup.object({
  enrollmentNumber: yup.string().required("Enrollment number is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup
    .string()
    .oneOf(Object.values(GenderEnum))
    .required("Gender is required"),
  address: yup.string(),
  phone: yup.string(),
  userId: yup.number().required("User is required"),
  classId: yup.number().nullable(),
  parentId: yup.number().nullable(),
});
