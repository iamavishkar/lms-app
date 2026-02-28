import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetResultsQuery, useDeleteResultMutation } from "../../app/api/resultsApi";
import { getErrorMessage, calculateGrade } from "../../utils/helpers";

const ResultList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: results = [], isLoading, error } = useGetResultsQuery();
  const [deleteResult] = useDeleteResultMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteResult(deleteId).unwrap();
      setSnackbar({ open: true, message: "Result deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load results" />;

  const columns: GridColDef[] = [
    {
      field: "student",
      headerName: "Student",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.student?.user?.name}</>,
    },
    {
      field: "exam",
      headerName: "Exam",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.exam?.name}</>,
    },
    { field: "marksObtained", headerName: "Marks Obtained", width: 130 },
    {
      field: "totalMarks",
      headerName: "Total Marks",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.exam?.totalMarks}</>,
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 90,
      renderCell: ({ row }) => {
        const grade = row.grade || calculateGrade(row.marksObtained, row.exam?.totalMarks ?? 100);
        return (
          <Chip
            label={grade}
            size="small"
            color={grade === "F" ? "error" : grade.startsWith("A") ? "success" : "primary"}
          />
        );
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
      renderCell: ({ value }) => <>{value || "-"}</>,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/results/${id}/edit`)}
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
        title="Results"
        subtitle={`${results.length} results`}
        action={{ label: "Add Result", icon: <Add />, onClick: () => navigate("/results/new") }}
      />
      <DataGrid
        rows={results}
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
