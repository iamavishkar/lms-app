import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, MenuItem, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateClassMutation, useUpdateClassMutation, useGetClassByIdQuery } from './classesApi';
import { useGetTeachersQuery } from '../teachers/teachersApi';
import { CreateClassDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  section: yup.string().optional(),
  academicYear: yup.string().required('Academic year is required'),
  teacherId: yup.number().optional(),
});

const ClassForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: cls, isLoading: loadingClass } = useGetClassByIdQuery(Number(id), { skip: !isEdit });
  const { data: teachers } = useGetTeachersQuery();
  const [createClass, { isLoading: creating }] = useCreateClassMutation();
  const [updateClass, { isLoading: updating }] = useUpdateClassMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateClassDto>({
    resolver: yupResolver(schema) as never,
    defaultValues: { name: '', section: '', academicYear: '' },
  });

  useEffect(() => {
    if (cls) {
      reset({
        name: cls.name,
        section: cls.section,
        academicYear: cls.academicYear,
        teacherId: cls.teacher?.id,
      });
    }
  }, [cls, reset]);

  const onSubmit = async (data: CreateClassDto) => {
    try {
      if (isEdit) {
        await updateClass({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Class updated', severity: 'success' });
      } else {
        await createClass(data).unwrap();
        setSnackbar({ open: true, message: 'Class created', severity: 'success' });
      }
      setTimeout(() => navigate('/classes'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingClass) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Class' : 'Create Class'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller name="name" control={control} render={({ field }) => (
                  <TextField {...field} label="Class Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="section" control={control} render={({ field }) => (
                  <TextField {...field} label="Section" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="academicYear" control={control} render={({ field }) => (
                  <TextField {...field} label="Academic Year" fullWidth error={!!errors.academicYear} helperText={errors.academicYear?.message} placeholder="e.g. 2024-2025" />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="teacherId" control={control} render={({ field }) => (
                  <TextField {...field} select label="Class Teacher" fullWidth value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    <MenuItem value="">None</MenuItem>
                    {teachers?.map((t) => <MenuItem key={t.id} value={t.id}>{t.user?.name}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {creating || updating ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/classes')}>Cancel</Button>
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

export default ClassForm;
