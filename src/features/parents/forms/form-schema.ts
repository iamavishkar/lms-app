import * as yup from "yup";

export const parentFormSchema = yup.object({
  phone: yup.string(),
  address: yup.string(),
  occupation: yup.string(),
  userId: yup.number().required("User is required"),
});
