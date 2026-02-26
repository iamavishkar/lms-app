import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetParentByIdQuery, useSaveParentMutation } from "../../api/parentsApi";
import { useGetUsersQuery } from "../../api/usersApi";
import { showSnackbar } from "../../store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { getParentFormFields } from "./forms/form-fields";
import { parentFormInitialValues } from "./forms/form-values";
import { parentFormSchema } from "./forms/form-schema";
import type { CreateParentDto } from "../../types";

const ParentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: parent, isLoading: loadingParent } = useGetParentByIdQuery(
    Number(id),
    { skip: !isEdit }
  );
  const { data: users = [] } = useGetUsersQuery();
  const [saveParent, { isLoading }] = useSaveParentMutation();

  const fields = useMemo(() => {
    return getParentFormFields().map((f) =>
      f.name === "userId"
        ? { ...f, options: users.map((u) => ({ label: u.name, value: u.id })) }
        : f
    );
  }, [users]);

  const initialValues = parent
    ? {
        phone: parent.phone ?? "",
        address: parent.address ?? "",
        occupation: parent.occupation ?? "",
        userId: parent.user?.id,
      }
    : parentFormInitialValues;

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveParent({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateParentDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit
            ? "Parent updated successfully"
            : "Parent created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.PARENTS.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingParent) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Parent" : "Add Parent"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={fields}
            initialValues={initialValues as unknown as Record<string, unknown>}
            validationSchema={parentFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.PARENTS.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ParentForm;
