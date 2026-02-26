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
import { useGetResultsQuery, useDeleteResultMutation } from '../../app/api/resultsApi';
import { getErrorMessage, calculateGrade } from '../../utils/helpers';

const ResultList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: results, isLoading, error } = useGetResultsQuery();
  const [deleteResult] = useDeleteResultMutation();

  const filtered = results?.filter(
    (r) => r.student?.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.exam?.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteResult(deleteId).unwrap();
      setSnackbar({ open: true, message: 'Result deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
    setDeleteId(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load results" />;

  return (
    <Box>
      <PageHeader
        title="Results"
        subtitle={`${filtered.length} results`}
        action={{ label: 'Add Result', icon: <Add />, onClick: () => navigate('/results/new') }}
      />
      <TextField
        placeholder="Search results..."
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
              <TableCell>Student</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Marks Obtained</TableCell>
              <TableCell>Total Marks</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((result) => {
              const grade = result.grade || calculateGrade(result.marksObtained, result.exam?.totalMarks ?? 100);
              return (
                <TableRow key={result.id} hover>
                  <TableCell>{result.student?.user?.name}</TableCell>
                  <TableCell>{result.exam?.name}</TableCell>
                  <TableCell>{result.marksObtained}</TableCell>
                  <TableCell>{result.exam?.totalMarks}</TableCell>
                  <TableCell>
                    <Chip
                      label={grade}
                      size="small"
                      color={grade === 'F' ? 'error' : grade.startsWith('A') ? 'success' : 'primary'}
                    />
                  </TableCell>
                  <TableCell>{result.remarks || '-'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/results/${result.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(result.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No results found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Result"
        message="Are you sure you want to delete this result?"
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

export default ResultList;
