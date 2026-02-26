import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Divider } from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useGetUserByIdQuery } from '../../app/api/usersApi';
import { formatDate } from '../../utils/helpers';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !user) return <ErrorAlert message="Failed to load user" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} variant="outlined">
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">User Details</Typography>
        </Box>
        <Button startIcon={<Edit />} variant="contained" onClick={() => navigate(`/users/${id}/edit`)}>
          Edit
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Name</Typography>
              <Typography variant="body1" fontWeight="bold">{user.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Role</Typography>
              <Box mt={0.5}>
                <Chip label={user.role?.name} color="primary" variant="outlined" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box mt={0.5}>
                <Chip label={user.isActive ? 'Active' : 'Inactive'} color={user.isActive ? 'success' : 'default'} />
              </Box>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Created At</Typography>
              <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Updated At</Typography>
              <Typography variant="body1">{formatDate(user.updatedAt)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetail;
