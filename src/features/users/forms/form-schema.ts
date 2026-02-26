import * as yup from "yup";

export const userFormSchema = (isEdit: boolean) =>
  yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: isEdit
      ? yup.string()
      : yup
          .string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
    roleId: yup.number().required("Role is required"),
    isActive: yup.boolean(),
  });
