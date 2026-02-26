import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetStudentByIdQuery, useSaveStudentMutation } from "../../api/studentsApi";
import { useGetUsersQuery } from "../../api/usersApi";
import { useGetClassesQuery } from "../../api/classesApi";
import { useGetParentsQuery } from "../../api/parentsApi";
import { showSnackbar } from "../../store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { getStudentFormFields } from "./forms/form-fields";
import { studentFormInitialValues } from "./forms/form-values";
import { studentFormSchema } from "./forms/form-schema";
import type { CreateStudentDto } from "../../types";

const StudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: student, isLoading: loadingStudent } = useGetStudentByIdQuery(
    Number(id),
    { skip: !isEdit }
  );
  const { data: users = [] } = useGetUsersQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: parents = [] } = useGetParentsQuery();
  const [saveStudent, { isLoading }] = useSaveStudentMutation();

  const fields = useMemo(() => {
    return getStudentFormFields().map((f) => {
      if (f.name === "userId")
        return {
          ...f,
          options: users.map((u) => ({ label: u.name, value: u.id })),
        };
      if (f.name === "classId")
        return {
          ...f,
          options: [
            { label: "None", value: "" },
            ...classes.map((c) => ({ label: c.name, value: c.id })),
          ],
        };
      if (f.name === "parentId")
        return {
          ...f,
          options: [
            { label: "None", value: "" },
            ...parents.map((p) => ({
              label: p.user?.name ?? `Parent #${p.id}`,
              value: p.id,
            })),
          ],
        };
      return f;
    });
  }, [users, classes, parents]);

  const initialValues = student
    ? {
        enrollmentNumber: student.enrollmentNumber,
        dateOfBirth: student.dateOfBirth?.split("T")[0] ?? "",
        gender: student.gender,
        address: student.address ?? "",
        phone: student.phone ?? "",
        userId: student.user?.id,
        classId: student.class?.id,
        parentId: student.parent?.id,
      }
    : studentFormInitialValues;

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveStudent({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateStudentDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit
            ? "Student updated successfully"
            : "Student created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.STUDENTS.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingStudent) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Student" : "Add Student"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={fields}
            initialValues={initialValues as unknown as Record<string, unknown>}
            validationSchema={studentFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.STUDENTS.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentForm;
