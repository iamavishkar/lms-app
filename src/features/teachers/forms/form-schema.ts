import * as yup from "yup";

export const teacherFormSchema = yup.object({
  employeeId: yup.string().required("Employee ID is required"),
  qualification: yup.string(),
  specialization: yup.string(),
  phone: yup.string(),
  address: yup.string(),
  userId: yup.number().required("User is required"),
});
