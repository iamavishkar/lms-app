import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tooltip, TextField, InputAdornment,
} from '@mui/material';
import { Add, Delete, Search } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useGetAttendanceQuery, useDeleteAttendanceMutation } from './attendanceApi';
import { getErrorMessage, formatDate } from '../../utils/helpers';

const statusColor: Record<string, 'success' | 'error' | 'warning'> = {
  present: 'success',
  absent: 'error',
  late: 'warning',
};

const AttendanceList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: attendance, isLoading, error } = useGetAttendanceQuery();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const filtered = attendance?.filter(
    (a) => a.student?.user?.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAttendance(deleteId).unwrap();
      setSnackbar({ open: true, message: 'Attendance record deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
    setDeleteId(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load attendance" />;

  return (
    <Box>
      <PageHeader
        title="Attendance"
        subtitle={`${filtered.length} records`}
        action={{ label: 'Mark Attendance', icon: <Add />, onClick: () => navigate('/attendance/mark') }}
      />
      <TextField
        placeholder="Search by student name..."
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
              <TableCell>Date</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id} hover>
                <TableCell>{formatDate(a.date)}</TableCell>
                <TableCell>{a.student?.user?.name}</TableCell>
                <TableCell>{a.class?.name}</TableCell>
                <TableCell>
                  <Chip label={a.status} size="small" color={statusColor[a.status] ?? 'default'} />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => setDeleteId(a.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">No attendance records found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Attendance"
        message="Are you sure you want to delete this attendance record?"
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

export default AttendanceList;
