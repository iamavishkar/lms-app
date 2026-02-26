import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateUserMutation, useUpdateUserMutation, useGetUserByIdQuery } from './usersApi';
import { useGetRolesQuery } from '../roles/rolesApi';
import { CreateUserDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';
import { useState } from 'react';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().when('$isEdit', {
    is: false,
    then: (s) => s.min(6).required('Password is required'),
    otherwise: (s) => s.optional(),
  }),
  roleId: yup.number().required('Role is required'),
  isActive: yup.boolean(),
});

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: user, isLoading: loadingUser } = useGetUserByIdQuery(Number(id), { skip: !isEdit });
  const { data: roles } = useGetRolesQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateUserDto & { password?: string }>({
    resolver: yupResolver(schema) as never,
    context: { isEdit },
    defaultValues: { name: '', email: '', password: '', isActive: true },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, roleId: user.role?.id, isActive: user.isActive });
    }
  }, [user, reset]);

  const onSubmit = async (data: CreateUserDto & { password?: string }) => {
    try {
      if (isEdit) {
        await updateUser({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      } else {
        await createUser(data as CreateUserDto).unwrap();
        setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      }
      setTimeout(() => navigate('/users'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingUser) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit User' : 'Create User'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Full Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Email" type="email" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                  )}
                />
              </Grid>
              {!isEdit && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Password" type="password" fullWidth error={!!errors.password} helperText={errors.password?.message} />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Role"
                      fullWidth
                      error={!!errors.roleId}
                      helperText={errors.roleId?.message}
                      value={field.value ?? ''}
                    >
                      {roles?.map((role) => (
                        <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Status"
                      fullWidth
                      value={field.value ? 'true' : 'false'}
                      onChange={(e) => field.onChange(e.target.value === 'true')}
                    >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {creating || updating ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/users')}>Cancel</Button>
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

export default UserForm;
