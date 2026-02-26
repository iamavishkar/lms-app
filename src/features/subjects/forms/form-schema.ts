import * as yup from "yup";

export const subjectFormSchema = yup.object({
  name: yup.string().required("Subject name is required"),
  code: yup.string().required("Subject code is required"),
  description: yup.string(),
});
