import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, MenuItem, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateParentMutation, useUpdateParentMutation, useGetParentByIdQuery } from './parentsApi';
import { useGetUsersQuery } from '../users/usersApi';
import { CreateParentDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const schema = yup.object({
  phone: yup.string().optional(),
  address: yup.string().optional(),
  occupation: yup.string().optional(),
  userId: yup.number().required('User is required'),
});

const ParentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: parent, isLoading: loadingParent } = useGetParentByIdQuery(Number(id), { skip: !isEdit });
  const { data: users } = useGetUsersQuery();
  const [createParent, { isLoading: creating }] = useCreateParentMutation();
  const [updateParent, { isLoading: updating }] = useUpdateParentMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateParentDto>({
    resolver: yupResolver(schema) as never,
    defaultValues: { phone: '', address: '', occupation: '' },
  });

  useEffect(() => {
    if (parent) {
      reset({
        phone: parent.phone,
        address: parent.address,
        occupation: parent.occupation,
        userId: parent.user?.id,
      });
    }
  }, [parent, reset]);

  const onSubmit = async (data: CreateParentDto) => {
    try {
      if (isEdit) {
        await updateParent({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Parent updated', severity: 'success' });
      } else {
        await createParent(data).unwrap();
        setSnackbar({ open: true, message: 'Parent created', severity: 'success' });
      }
      setTimeout(() => navigate('/parents'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingParent) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Parent' : 'Add Parent'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller name="userId" control={control} render={({ field }) => (
                  <TextField {...field} select label="User Account" fullWidth error={!!errors.userId} helperText={errors.userId?.message} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    {users?.map((u) => <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="phone" control={control} render={({ field }) => (
                  <TextField {...field} label="Phone" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="occupation" control={control} render={({ field }) => (
                  <TextField {...field} label="Occupation" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="address" control={control} render={({ field }) => (
                  <TextField {...field} label="Address" fullWidth multiline rows={2} />
                )} />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {creating || updating ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/parents')}>Cancel</Button>
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

export default ParentForm;
