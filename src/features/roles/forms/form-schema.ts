import * as yup from "yup";

export const roleFormSchema = yup.object({
  name: yup.string().required("Role name is required"),
  description: yup.string(),
});
