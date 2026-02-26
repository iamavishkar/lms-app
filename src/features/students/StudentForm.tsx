import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, MenuItem, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateStudentMutation, useUpdateStudentMutation, useGetStudentByIdQuery } from './studentsApi';
import { useGetUsersQuery } from '../users/usersApi';
import { useGetClassesQuery } from '../classes/classesApi';
import { CreateStudentDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';
import { GENDERS } from '../../utils/constants';

const schema = yup.object({
  enrollmentNumber: yup.string().required('Enrollment number is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().optional(),
  phone: yup.string().optional(),
  userId: yup.number().required('User is required'),
  classId: yup.number().optional(),
});

const StudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: student, isLoading: loadingStudent } = useGetStudentByIdQuery(Number(id), { skip: !isEdit });
  const { data: users } = useGetUsersQuery();
  const { data: classes } = useGetClassesQuery();
  const [createStudent, { isLoading: creating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateStudentDto>({
    resolver: yupResolver(schema) as never,
    defaultValues: { enrollmentNumber: '', dateOfBirth: '', gender: '', address: '', phone: '' },
  });

  useEffect(() => {
    if (student) {
      reset({
        enrollmentNumber: student.enrollmentNumber,
        dateOfBirth: student.dateOfBirth?.split('T')[0],
        gender: student.gender,
        address: student.address,
        phone: student.phone,
        userId: student.user?.id,
        classId: student.class?.id,
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: CreateStudentDto) => {
    try {
      if (isEdit) {
        await updateStudent({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Student updated', severity: 'success' });
      } else {
        await createStudent(data).unwrap();
        setSnackbar({ open: true, message: 'Student created', severity: 'success' });
      }
      setTimeout(() => navigate('/students'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingStudent) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Student' : 'Add Student'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller name="enrollmentNumber" control={control} render={({ field }) => (
                  <TextField {...field} label="Enrollment Number" fullWidth error={!!errors.enrollmentNumber} helperText={errors.enrollmentNumber?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="dateOfBirth" control={control} render={({ field }) => (
                  <TextField {...field} label="Date of Birth" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="gender" control={control} render={({ field }) => (
                  <TextField {...field} select label="Gender" fullWidth error={!!errors.gender} helperText={errors.gender?.message} value={field.value ?? ''}>
                    {GENDERS.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="userId" control={control} render={({ field }) => (
                  <TextField {...field} select label="User Account" fullWidth error={!!errors.userId} helperText={errors.userId?.message} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    {users?.map((u) => <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="classId" control={control} render={({ field }) => (
                  <TextField {...field} select label="Class" fullWidth value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    <MenuItem value="">None</MenuItem>
                    {classes?.map((c) => <MenuItem key={c.id} value={c.id}>{c.name} {c.section}</MenuItem>)}
                  </TextField>
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
              <Button variant="outlined" onClick={() => navigate('/students')}>Cancel</Button>
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

export default StudentForm;
