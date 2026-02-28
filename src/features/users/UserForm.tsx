import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetUserByIdQuery, useSaveUserMutation } from "../../app/api/usersApi";
import { useGetRolesQuery } from "../../app/api/rolesApi";
import { showSnackbar } from "../../app/store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { userFormFields } from "../../forms/form-fields";
import { userInitialValues } from "../../forms/form-values";
import { createUserFormSchema, updateUserFormSchema } from "../../forms/form-schema";
import type { CreateUserDto } from "../../interfaces";

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isLoading: loadingUser } = useGetUserByIdQuery(Number(id), { skip: !isEdit });
  const { data: roles = [] } = useGetRolesQuery();
  const [saveUser, { isLoading }] = useSaveUserMutation();

  const fields = useMemo(
    () =>
      userFormFields.map((f) => {
        if (f.name === "roleId")
          return { ...f, options: roles.map((r) => ({ label: r.name, value: r.id })) };
        if (f.name === "password") return { ...f, hidden: isEdit, required: !isEdit };
        return f;
      }),
    [isEdit, roles]
  );

  const editValues = user
    ? {
        name: user.name,
        email: user.email,
        password: "",
        roleId: user.role?.id,
        isActive: user.isActive,
      }
    : undefined;

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveUser({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateUserDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit ? "User updated successfully" : "User created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.USERS.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingUser) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit User" : "Create User"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={fields}
            initialValues={(editValues || userInitialValues) as unknown as Record<string, unknown>}
            validationSchema={isEdit ? updateUserFormSchema : createUserFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.USERS.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserForm;
