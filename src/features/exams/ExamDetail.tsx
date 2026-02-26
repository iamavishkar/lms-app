import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Divider } from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useGetExamByIdQuery } from '../../api/examsApi';
import { formatDate } from '../../utils/helpers';

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: exam, isLoading, error } = useGetExamByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !exam) return <ErrorAlert message="Failed to load exam" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/exams')} variant="outlined">Back</Button>
          <Typography variant="h5" fontWeight="bold">Exam Details</Typography>
        </Box>
        <Button startIcon={<Edit />} variant="contained" onClick={() => navigate(`/exams/${id}/edit`)}>Edit</Button>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Exam Name</Typography>
              <Typography fontWeight="bold" variant="h6">{exam.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Type</Typography>
              <Box mt={0.5}><Chip label={exam.type} /></Box>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Subject</Typography>
              <Typography>{exam.subject?.name}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Class</Typography>
              <Typography>{exam.class?.name}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Date</Typography>
              <Typography>{formatDate(exam.date)}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Duration</Typography>
              <Typography>{exam.duration} minutes</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Total Marks</Typography>
              <Typography fontWeight="bold">{exam.totalMarks}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExamDetail;
