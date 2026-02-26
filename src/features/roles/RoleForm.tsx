import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetRoleByIdQuery, useSaveRoleMutation } from "../../app/api/rolesApi";
import { showSnackbar } from "../../app/store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { roleFormFields } from "../../forms/form-fields";
import { getRoleFormValues } from "../../forms/form-values";
import { roleFormSchema } from "../../forms/form-schema";
import type { CreateRoleDto } from "../../interfaces";

const RoleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: role, isLoading: loadingRole } = useGetRoleByIdQuery(
    Number(id),
    { skip: !isEdit }
  );
  const [saveRole, { isLoading }] = useSaveRoleMutation();

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveRole({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateRoleDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit
            ? "Role updated successfully"
            : "Role created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.ROLES.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingRole) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Role" : "Create Role"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={roleFormFields}
            initialValues={
              getRoleFormValues(role) as unknown as Record<string, unknown>
            }
            validationSchema={roleFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.ROLES.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoleForm;
