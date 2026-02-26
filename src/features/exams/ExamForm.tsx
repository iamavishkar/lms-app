import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, MenuItem, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateExamMutation, useUpdateExamMutation, useGetExamByIdQuery } from './examsApi';
import { useGetSubjectsQuery } from '../subjects/subjectsApi';
import { useGetClassesQuery } from '../classes/classesApi';
import { CreateExamDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';
import { EXAM_TYPES } from '../../utils/constants';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  date: yup.string().required('Date is required'),
  duration: yup.number().min(1).required('Duration is required'),
  totalMarks: yup.number().min(1).required('Total marks is required'),
  subjectId: yup.number().required('Subject is required'),
  classId: yup.number().required('Class is required'),
});

const ExamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: exam, isLoading: loadingExam } = useGetExamByIdQuery(Number(id), { skip: !isEdit });
  const { data: subjects } = useGetSubjectsQuery();
  const { data: classes } = useGetClassesQuery();
  const [createExam, { isLoading: creating }] = useCreateExamMutation();
  const [updateExam, { isLoading: updating }] = useUpdateExamMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateExamDto>({
    resolver: yupResolver(schema) as never,
    defaultValues: { name: '', type: '', date: '', duration: 60, totalMarks: 100 },
  });

  useEffect(() => {
    if (exam) {
      reset({
        name: exam.name,
        type: exam.type,
        date: exam.date?.split('T')[0],
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        subjectId: exam.subject?.id,
        classId: exam.class?.id,
      });
    }
  }, [exam, reset]);

  const onSubmit = async (data: CreateExamDto) => {
    try {
      if (isEdit) {
        await updateExam({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Exam updated', severity: 'success' });
      } else {
        await createExam(data).unwrap();
        setSnackbar({ open: true, message: 'Exam created', severity: 'success' });
      }
      setTimeout(() => navigate('/exams'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingExam) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Exam' : 'Create Exam'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller name="name" control={control} render={({ field }) => (
                  <TextField {...field} label="Exam Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="type" control={control} render={({ field }) => (
                  <TextField {...field} select label="Exam Type" fullWidth error={!!errors.type} helperText={errors.type?.message} value={field.value ?? ''}>
                    {EXAM_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="date" control={control} render={({ field }) => (
                  <TextField {...field} label="Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.date} helperText={errors.date?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller name="duration" control={control} render={({ field }) => (
                  <TextField {...field} label="Duration (mins)" type="number" fullWidth error={!!errors.duration} helperText={errors.duration?.message} onChange={(e) => field.onChange(Number(e.target.value))} />
                )} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller name="totalMarks" control={control} render={({ field }) => (
                  <TextField {...field} label="Total Marks" type="number" fullWidth error={!!errors.totalMarks} helperText={errors.totalMarks?.message} onChange={(e) => field.onChange(Number(e.target.value))} />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="subjectId" control={control} render={({ field }) => (
                  <TextField {...field} select label="Subject" fullWidth error={!!errors.subjectId} helperText={errors.subjectId?.message} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    {subjects?.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="classId" control={control} render={({ field }) => (
                  <TextField {...field} select label="Class" fullWidth error={!!errors.classId} helperText={errors.classId?.message} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    {classes?.map((c) => <MenuItem key={c.id} value={c.id}>{c.name} {c.section}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {creating || updating ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/exams')}>Cancel</Button>
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

export default ExamForm;
