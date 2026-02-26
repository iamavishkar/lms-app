import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tooltip, TextField, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useGetSubjectsQuery, useDeleteSubjectMutation } from './subjectsApi';
import { getErrorMessage } from '../../utils/helpers';

const SubjectList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: subjects, isLoading, error } = useGetSubjectsQuery();
  const [deleteSubject] = useDeleteSubjectMutation();

  const filtered = subjects?.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubject(deleteId).unwrap();
      setSnackbar({ open: true, message: 'Subject deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
    setDeleteId(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load subjects" />;

  return (
    <Box>
      <PageHeader
        title="Subjects"
        subtitle={`${filtered.length} subjects`}
        action={{ label: 'Add Subject', icon: <Add />, onClick: () => navigate('/subjects/new') }}
      />
      <TextField
        placeholder="Search subjects..."
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
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((subject) => (
              <TableRow key={subject.id} hover>
                <TableCell><Chip label={subject.code} size="small" color="secondary" /></TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.description || '-'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/subjects/${subject.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(subject.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">No subjects found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Subject"
        message="Are you sure you want to delete this subject?"
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

export default SubjectList;
