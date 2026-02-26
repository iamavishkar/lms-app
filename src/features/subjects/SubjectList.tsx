import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetSubjectsQuery, useDeleteSubjectMutation } from "../../app/api/subjectsApi";
import { getErrorMessage } from "../../utils/helpers";

const SubjectList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const { data: subjects = [], isLoading, error } = useGetSubjectsQuery();
  const [deleteSubject] = useDeleteSubjectMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubject(deleteId).unwrap();
      setSnackbar({ open: true, message: "Subject deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load subjects" />;

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      width: 120,
      renderCell: ({ value }) => <Chip label={value} size="small" color="secondary" />,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2, valueGetter: (value) => value || "-" },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => [
        <GridActionsCellItem key="edit" icon={<Edit />} label="Edit" onClick={() => navigate(`/subjects/${id}/edit`)} />,
        <GridActionsCellItem key="delete" icon={<Delete />} label="Delete" onClick={() => setDeleteId(id as number)} color="error" />,
      ],
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Subjects"
        subtitle={`${subjects.length} subjects`}
        action={{ label: "Add Subject", icon: <Add />, onClick: () => navigate("/subjects/new") }}
      />
      <DataGrid
        rows={subjects}
        columns={columns}
        loading={isLoading}
        autoHeight
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
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
