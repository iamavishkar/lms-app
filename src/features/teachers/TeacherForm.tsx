import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetTeacherByIdQuery, useSaveTeacherMutation } from "../../api/teachersApi";
import { useGetUsersQuery } from "../../api/usersApi";
import { showSnackbar } from "../../store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { getTeacherFormFields } from "./forms/form-fields";
import { teacherFormInitialValues } from "./forms/form-values";
import { teacherFormSchema } from "./forms/form-schema";
import type { CreateTeacherDto } from "../../types";

const TeacherForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: teacher, isLoading: loadingTeacher } = useGetTeacherByIdQuery(
    Number(id),
    { skip: !isEdit }
  );
  const { data: users = [] } = useGetUsersQuery();
  const [saveTeacher, { isLoading }] = useSaveTeacherMutation();

  const fields = useMemo(() => {
    return getTeacherFormFields().map((f) =>
      f.name === "userId"
        ? { ...f, options: users.map((u) => ({ label: u.name, value: u.id })) }
        : f
    );
  }, [users]);

  const initialValues = teacher
    ? {
        employeeId: teacher.employeeId,
        qualification: teacher.qualification ?? "",
        specialization: teacher.specialization ?? "",
        phone: teacher.phone ?? "",
        address: teacher.address ?? "",
        userId: teacher.user?.id,
      }
    : teacherFormInitialValues;

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveTeacher({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateTeacherDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit
            ? "Teacher updated successfully"
            : "Teacher created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.TEACHERS.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingTeacher) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Teacher" : "Add Teacher"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={fields}
            initialValues={initialValues as unknown as Record<string, unknown>}
            validationSchema={teacherFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.TEACHERS.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeacherForm;
