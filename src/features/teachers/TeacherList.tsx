import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useGetTeachersQuery, useDeleteTeacherMutation } from '../../app/api/teachersApi';
import { getErrorMessage } from '../../utils/helpers';

const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: teachers, isLoading, error } = useGetTeachersQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const filtered = teachers?.filter(
    (t) => t.user?.name.toLowerCase().includes(search.toLowerCase()) || t.employeeId.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTeacher(deleteId).unwrap();
      setSnackbar({ open: true, message: 'Teacher deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
    setDeleteId(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load teachers" />;

  return (
    <Box>
      <PageHeader
        title="Teachers"
        subtitle={`${filtered.length} teachers`}
        action={{ label: 'Add Teacher', icon: <Add />, onClick: () => navigate('/teachers/new') }}
      />
      <TextField
        placeholder="Search teachers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, width: 300 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((teacher) => (
              <TableRow key={teacher.id} hover>
                <TableCell>{teacher.employeeId}</TableCell>
                <TableCell>{teacher.user?.name}</TableCell>
                <TableCell>{teacher.specialization || '-'}</TableCell>
                <TableCell>{teacher.qualification || '-'}</TableCell>
                <TableCell>{teacher.phone || '-'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/teachers/${teacher.id}`)}><Visibility fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/teachers/${teacher.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(teacher.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No teachers found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
        severity="error"
      />
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
};

export default TeacherList;
