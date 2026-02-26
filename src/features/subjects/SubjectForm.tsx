import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetSubjectByIdQuery, useSaveSubjectMutation } from "../../app/api/subjectsApi";
import { showSnackbar } from "../../app/store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { subjectFormFields } from "../../forms/form-fields";
import { getSubjectFormValues } from "../../forms/form-values";
import { subjectFormSchema } from "../../forms/form-schema";
import type { CreateSubjectDto } from "../../interfaces";

const SubjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: subject, isLoading: loadingSubject } = useGetSubjectByIdQuery(
    Number(id),
    { skip: !isEdit }
  );
  const [saveSubject, { isLoading }] = useSaveSubjectMutation();

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveSubject({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateSubjectDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit
            ? "Subject updated successfully"
            : "Subject created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.SUBJECTS.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingSubject) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Subject" : "Add Subject"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={subjectFormFields}
            initialValues={
              getSubjectFormValues(subject) as unknown as Record<string, unknown>
            }
            validationSchema={subjectFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.SUBJECTS.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubjectForm;
