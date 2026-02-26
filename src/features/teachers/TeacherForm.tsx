import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, MenuItem, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateTeacherMutation, useUpdateTeacherMutation, useGetTeacherByIdQuery } from './teachersApi';
import { useGetUsersQuery } from '../users/usersApi';
import { CreateTeacherDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const schema = yup.object({
  employeeId: yup.string().required('Employee ID is required'),
  qualification: yup.string().optional(),
  specialization: yup.string().optional(),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  userId: yup.number().required('User is required'),
});

const TeacherForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: teacher, isLoading: loadingTeacher } = useGetTeacherByIdQuery(Number(id), { skip: !isEdit });
  const { data: users } = useGetUsersQuery();
  const [createTeacher, { isLoading: creating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: updating }] = useUpdateTeacherMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateTeacherDto>({
    resolver: yupResolver(schema) as never,
    defaultValues: { employeeId: '', qualification: '', specialization: '', phone: '', address: '' },
  });

  useEffect(() => {
    if (teacher) {
      reset({
        employeeId: teacher.employeeId,
        qualification: teacher.qualification,
        specialization: teacher.specialization,
        phone: teacher.phone,
        address: teacher.address,
        userId: teacher.user?.id,
      });
    }
  }, [teacher, reset]);

  const onSubmit = async (data: CreateTeacherDto) => {
    try {
      if (isEdit) {
        await updateTeacher({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Teacher updated', severity: 'success' });
      } else {
        await createTeacher(data).unwrap();
        setSnackbar({ open: true, message: 'Teacher created', severity: 'success' });
      }
      setTimeout(() => navigate('/teachers'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingTeacher) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Teacher' : 'Add Teacher'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller name="employeeId" control={control} render={({ field }) => (
                  <TextField {...field} label="Employee ID" fullWidth error={!!errors.employeeId} helperText={errors.employeeId?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="userId" control={control} render={({ field }) => (
                  <TextField {...field} select label="User Account" fullWidth error={!!errors.userId} helperText={errors.userId?.message} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    {users?.map((u) => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="qualification" control={control} render={({ field }) => (
                  <TextField {...field} label="Qualification" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="specialization" control={control} render={({ field }) => (
                  <TextField {...field} label="Specialization" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="phone" control={control} render={({ field }) => (
                  <TextField {...field} label="Phone" fullWidth />
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
              <Button variant="outlined" onClick={() => navigate('/teachers')}>Cancel</Button>
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

export default TeacherForm;
