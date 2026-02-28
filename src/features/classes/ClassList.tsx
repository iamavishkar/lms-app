import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetClassesQuery, useDeleteClassMutation } from "../../app/api/classesApi";
import { getErrorMessage } from "../../utils/helpers";

const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: classes = [], isLoading, error } = useGetClassesQuery();
  const [deleteClass] = useDeleteClassMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteClass(deleteId).unwrap();
      setSnackbar({ open: true, message: "Class deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load classes" />;

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: ({ value }) => <Chip label={value} size="small" color="primary" />,
    },
    {
      field: "section",
      headerName: "Section",
      width: 100,
      renderCell: ({ value }) => <>{value || "-"}</>,
    },
    { field: "academicYear", headerName: "Academic Year", width: 140 },
    {
      field: "teacher",
      headerName: "Teacher",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.teacher?.user?.name || "-"}</>,
    },
    {
      field: "students",
      headerName: "Students",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.students?.length ?? 0}</>,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => [
        <GridActionsCellItem
          key="view"
          icon={<Visibility />}
          label="View"
          onClick={() => navigate(`/classes/${id}`)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/classes/${id}/edit`)}
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
        title="Classes"
        subtitle={`${classes.length} classes`}
        action={{ label: "Add Class", icon: <Add />, onClick: () => navigate("/classes/new") }}
      />
      <DataGrid
        rows={classes}
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
        title="Delete Class"
        message="Are you sure you want to delete this class?"
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

export default ClassList;
