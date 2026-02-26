import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tooltip, TextField, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useGetExamsQuery, useDeleteExamMutation } from './examsApi';
import { getErrorMessage, formatDate } from '../../utils/helpers';

const ExamList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: exams, isLoading, error } = useGetExamsQuery();
  const [deleteExam] = useDeleteExamMutation();

  const filtered = exams?.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExam(deleteId).unwrap();
      setSnackbar({ open: true, message: 'Exam deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
    setDeleteId(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load exams" />;

  return (
    <Box>
      <PageHeader
        title="Exams"
        subtitle={`${filtered.length} exams`}
        action={{ label: 'Create Exam', icon: <Add />, onClick: () => navigate('/exams/new') }}
      />
      <TextField
        placeholder="Search exams..."
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
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Marks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((exam) => (
              <TableRow key={exam.id} hover>
                <TableCell>{exam.name}</TableCell>
                <TableCell><Chip label={exam.type} size="small" /></TableCell>
                <TableCell>{exam.subject?.name}</TableCell>
                <TableCell>{exam.class?.name}</TableCell>
                <TableCell>{formatDate(exam.date)}</TableCell>
                <TableCell>{exam.totalMarks}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/exams/${exam.id}`)}><Visibility fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/exams/${exam.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(exam.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No exams found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Exam"
        message="Are you sure you want to delete this exam?"
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

export default ExamList;
