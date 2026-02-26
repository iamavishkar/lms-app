import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetClassByIdQuery, useSaveClassMutation } from "../../app/api/classesApi";
import { useGetTeachersQuery } from "../../app/api/teachersApi";
import { showSnackbar } from "../../app/store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { classFormFields } from "../../forms/form-fields";
import { classInitialValues, getClassFormValues } from "../../forms/form-values";
import { classFormSchema } from "../../forms/form-schema";
import type { CreateClassDto } from "../../interfaces";

const ClassForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: cls, isLoading: loadingClass } = useGetClassByIdQuery(
    Number(id),
    { skip: !isEdit }
  );
  const { data: teachers = [] } = useGetTeachersQuery();
  const [saveClass, { isLoading }] = useSaveClassMutation();

  const fields = useMemo(
    () =>
      classFormFields.map((f) =>
        f.name === "teacherId"
          ? {
              ...f,
              options: [
                { label: "None", value: "" },
                ...teachers.map((t) => ({
                  label: t.user?.name ?? `Teacher #${t.id}`,
                  value: t.id,
                })),
              ],
            }
          : f
      ),
    [teachers]
  );

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveClass({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateClassDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit
            ? "Class updated successfully"
            : "Class created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.CLASSES.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingClass) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Class" : "Create Class"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={fields}
            initialValues={
              getClassFormValues(cls) as unknown as Record<string, unknown>
            }
            validationSchema={classFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.CLASSES.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClassForm;
