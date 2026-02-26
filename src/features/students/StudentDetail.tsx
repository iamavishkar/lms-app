import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Divider, Avatar } from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useGetStudentByIdQuery } from '../../app/api/studentsApi';
import { formatDate } from '../../utils/helpers';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading, error } = useGetStudentByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !student) return <ErrorAlert message="Failed to load student" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/students')} variant="outlined">Back</Button>
          <Typography variant="h5" fontWeight="bold">Student Profile</Typography>
        </Box>
        <Button startIcon={<Edit />} variant="contained" onClick={() => navigate(`/students/${id}/edit`)}>Edit</Button>
      </Box>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28 }}>
              {student.user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{student.user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{student.user?.email}</Typography>
              <Chip label={student.enrollmentNumber} size="small" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
              <Typography>{formatDate(student.dateOfBirth)}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">Gender</Typography>
              <Typography>{student.gender}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">Phone</Typography>
              <Typography>{student.phone || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">Class</Typography>
              <Typography>{student.class ? `${student.class.name} ${student.class.section || ''}` : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">Address</Typography>
              <Typography>{student.address || '-'}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" gap={2}>
            <Button variant="outlined" size="small" onClick={() => navigate(`/students/${id}/attendance`)}>
              View Attendance
            </Button>
            <Button variant="outlined" size="small" onClick={() => navigate(`/students/${id}/results`)}>
              View Results
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentDetail;
