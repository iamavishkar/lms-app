import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetStudentsQuery, useDeleteStudentMutation } from "../../app/api/studentsApi";
import { getErrorMessage } from "../../utils/helpers";

const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const { data: students = [], isLoading, error } = useGetStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStudent(deleteId).unwrap();
      setSnackbar({ open: true, message: "Student deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load students" />;

  const columns: GridColDef[] = [
    {
      field: "enrollmentNumber",
      headerName: "Enrollment #",
      width: 150,
      renderCell: ({ value }) => <Chip label={value} size="small" />,
    },
    { field: "name", headerName: "Name", flex: 1, valueGetter: (_, row) => row.user?.name },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "class", headerName: "Class", width: 120, valueGetter: (_, row) => row.class?.name || "-" },
    { field: "phone", headerName: "Phone", width: 130, valueGetter: (value) => value || "-" },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => [
        <GridActionsCellItem key="view" icon={<Visibility />} label="View" onClick={() => navigate(`/students/${id}`)} />,
        <GridActionsCellItem key="edit" icon={<Edit />} label="Edit" onClick={() => navigate(`/students/${id}/edit`)} />,
        <GridActionsCellItem key="delete" icon={<Delete />} label="Delete" onClick={() => setDeleteId(id as number)} color="error" />,
      ],
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Students"
        subtitle={`${students.length} students`}
        action={{ label: "Add Student", icon: <Add />, onClick: () => navigate("/students/new") }}
      />
      <DataGrid
        rows={students}
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
        title="Delete Student"
        message="Are you sure you want to delete this student?"
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

export default StudentList;
