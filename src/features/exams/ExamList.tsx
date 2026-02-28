import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetExamsQuery, useDeleteExamMutation } from "../../app/api/examsApi";
import { getErrorMessage, formatDate } from "../../utils/helpers";

const ExamList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: exams = [], isLoading, error } = useGetExamsQuery();
  const [deleteExam] = useDeleteExamMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExam(deleteId).unwrap();
      setSnackbar({ open: true, message: "Exam deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load exams" />;

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: ({ value }) => <Chip label={value} size="small" />,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.subject?.name}</>,
    },
    {
      field: "class",
      headerName: "Class",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.class?.name}</>,
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: ({ value }) => <>{formatDate(value)}</>,
    },
    { field: "totalMarks", headerName: "Total Marks", width: 110 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => [
        <GridActionsCellItem
          key="view"
          icon={<Visibility />}
          label="View"
          onClick={() => navigate(`/exams/${id}`)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/exams/${id}/edit`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete color="error" />}
          label="Delete"
          onClick={() => setDeleteId(id as number)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Exams"
        subtitle={`${exams.length} exams`}
        action={{ label: "Create Exam", icon: <Add />, onClick: () => navigate("/exams/new") }}
      />
      <DataGrid
        rows={exams}
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
