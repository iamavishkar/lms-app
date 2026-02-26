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
import { useGetParentsQuery, useDeleteParentMutation } from './parentsApi';
import { getErrorMessage } from '../../utils/helpers';

const ParentList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: parents, isLoading, error } = useGetParentsQuery();
  const [deleteParent] = useDeleteParentMutation();

  const filtered = parents?.filter(
    (p) => p.user?.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteParent(deleteId).unwrap();
      setSnackbar({ open: true, message: 'Parent deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
    }
    setDeleteId(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load parents" />;

  return (
    <Box>
      <PageHeader
        title="Parents"
        subtitle={`${filtered.length} parents`}
        action={{ label: 'Add Parent', icon: <Add />, onClick: () => navigate('/parents/new') }}
      />
      <TextField
        placeholder="Search parents..."
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Children</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((parent) => (
              <TableRow key={parent.id} hover>
                <TableCell>{parent.user?.name}</TableCell>
                <TableCell>{parent.user?.email}</TableCell>
                <TableCell>{parent.phone || '-'}</TableCell>
                <TableCell>{parent.occupation || '-'}</TableCell>
                <TableCell>{parent.students?.length ?? 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/parents/${parent.id}`)}><Visibility fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/parents/${parent.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(parent.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No parents found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Parent"
        message="Are you sure you want to delete this parent?"
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

export default ParentList;
