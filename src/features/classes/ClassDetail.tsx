import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Button, Divider, Chip, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useGetClassByIdQuery } from './classesApi';

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cls, isLoading, error } = useGetClassByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !cls) return <ErrorAlert message="Failed to load class" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/classes')} variant="outlined">Back</Button>
          <Typography variant="h5" fontWeight="bold">Class Details</Typography>
        </Box>
        <Button startIcon={<Edit />} variant="contained" onClick={() => navigate(`/classes/${id}/edit`)}>Edit</Button>
      </Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Class Name</Typography>
              <Typography fontWeight="bold">{cls.name}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Section</Typography>
              <Typography>{cls.section || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Academic Year</Typography>
              <Typography>{cls.academicYear}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Class Teacher</Typography>
              <Typography>{cls.teacher?.user?.name || '-'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {cls.students && cls.students.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Students ({cls.students.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Enrollment #</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cls.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell><Chip label={student.enrollmentNumber} size="small" /></TableCell>
                    <TableCell>{student.user?.name}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ClassDetail;
