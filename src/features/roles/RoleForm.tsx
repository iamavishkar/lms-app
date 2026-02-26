import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateRoleMutation, useUpdateRoleMutation, useGetRoleByIdQuery } from './rolesApi';
import { CreateRoleDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().optional(),
});

const RoleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: role, isLoading: loadingRole } = useGetRoleByIdQuery(Number(id), { skip: !isEdit });
  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateRoleDto>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (role) reset({ name: role.name, description: role.description });
  }, [role, reset]);

  const onSubmit = async (data: CreateRoleDto) => {
    try {
      if (isEdit) {
        await updateRole({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Role updated', severity: 'success' });
      } else {
        await createRole(data).unwrap();
        setSnackbar({ open: true, message: 'Role created', severity: 'success' });
      }
      setTimeout(() => navigate('/roles'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingRole) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Role' : 'Create Role'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Role Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Description" fullWidth />
                  )}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {creating || updating ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/roles')}>Cancel</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
};

export default RoleForm;
