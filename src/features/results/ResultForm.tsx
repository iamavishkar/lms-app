import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, MenuItem, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateResultMutation, useUpdateResultMutation, useGetResultByIdQuery } from './resultsApi';
import { useGetStudentsQuery } from '../students/studentsApi';
import { useGetExamsQuery } from '../exams/examsApi';
import { CreateResultDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const schema = yup.object({
  marksObtained: yup.number().min(0).required('Marks are required'),
  grade: yup.string().optional(),
  remarks: yup.string().optional(),
  studentId: yup.number().required('Student is required'),
  examId: yup.number().required('Exam is required'),
});

const ResultForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: result, isLoading: loadingResult } = useGetResultByIdQuery(Number(id), { skip: !isEdit });
  const { data: students } = useGetStudentsQuery();
  const { data: exams } = useGetExamsQuery();
  const [createResult, { isLoading: creating }] = useCreateResultMutation();
  const [updateResult, { isLoading: updating }] = useUpdateResultMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateResultDto>({
    resolver: yupResolver(schema) as never,
    defaultValues: { marksObtained: 0, grade: '', remarks: '' },
  });

  useEffect(() => {
    if (result) {
      reset({
        marksObtained: result.marksObtained,
        grade: result.grade,
        remarks: result.remarks,
        studentId: result.student?.id,
        examId: result.exam?.id,
      });
    }
  }, [result, reset]);

  const onSubmit = async (data: CreateResultDto) => {
    try {
      if (isEdit) {
        await updateResult({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Result updated', severity: 'success' });
      } else {
        await createResult(data).unwrap();
        setSnackbar({ open: true, message: 'Result created', severity: 'success' });
      }
      setTimeout(() => navigate('/results'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingResult) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Result' : 'Enter Result'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller name="studentId" control={control} render={({ field }) => (
                  <TextField {...field} select label="Student" fullWidth error={!!errors.studentId} helperText={errors.studentId?.message} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    {students?.map((s) => <MenuItem key={s.id} value={s.id}>{s.user?.name}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="examId" control={control} render={({ field }) => (
                  <TextField {...field} select label="Exam" fullWidth error={!!errors.examId} helperText={errors.examId?.message} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                    {exams?.map((e) => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="marksObtained" control={control} render={({ field }) => (
                  <TextField {...field} label="Marks Obtained" type="number" fullWidth error={!!errors.marksObtained} helperText={errors.marksObtained?.message} onChange={(e) => field.onChange(Number(e.target.value))} />
                )} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="grade" control={control} render={({ field }) => (
                  <TextField {...field} label="Grade (Optional)" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="remarks" control={control} render={({ field }) => (
                  <TextField {...field} label="Remarks" fullWidth multiline rows={2} />
                )} />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {creating || updating ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Submit'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/results')}>Cancel</Button>
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

export default ResultForm;
