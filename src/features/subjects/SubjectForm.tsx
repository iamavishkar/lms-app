import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useCreateSubjectMutation, useUpdateSubjectMutation, useGetSubjectByIdQuery } from './subjectsApi';
import { CreateSubjectDto } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  code: yup.string().required('Code is required'),
  description: yup.string().optional(),
});

const SubjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: subject, isLoading: loadingSubject } = useGetSubjectByIdQuery(Number(id), { skip: !isEdit });
  const [createSubject, { isLoading: creating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: updating }] = useUpdateSubjectMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateSubjectDto>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', code: '', description: '' },
  });

  useEffect(() => {
    if (subject) reset({ name: subject.name, code: subject.code, description: subject.description });
  }, [subject, reset]);

  const onSubmit = async (data: CreateSubjectDto) => {
    try {
      if (isEdit) {
        await updateSubject({ id: Number(id), data }).unwrap();
        setSnackbar({ open: true, message: 'Subject updated', severity: 'success' });
      } else {
        await createSubject(data).unwrap();
        setSnackbar({ open: true, message: 'Subject created', severity: 'success' });
      }
      setTimeout(() => navigate('/subjects'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
  };

  if (isEdit && loadingSubject) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? 'Edit Subject' : 'Create Subject'} />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller name="name" control={control} render={({ field }) => (
                  <TextField {...field} label="Subject Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="code" control={control} render={({ field }) => (
                  <TextField {...field} label="Subject Code" fullWidth error={!!errors.code} helperText={errors.code?.message} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="description" control={control} render={({ field }) => (
                  <TextField {...field} label="Description" fullWidth multiline rows={3} />
                )} />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={creating || updating}>
                {creating || updating ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/subjects')}>Cancel</Button>
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

export default SubjectForm;
