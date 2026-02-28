import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetTeachersQuery, useDeleteTeacherMutation } from "../../app/api/teachersApi";
import { getErrorMessage } from "../../utils/helpers";

const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: teachers = [], isLoading, error } = useGetTeachersQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTeacher(deleteId).unwrap();
      setSnackbar({ open: true, message: "Teacher deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load teachers" />;

  const columns: GridColDef[] = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    {
      field: "user",
      headerName: "Name",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.user?.name}</>,
    },
    {
      field: "specialization",
      headerName: "Specialization",
      flex: 1,
      renderCell: ({ value }) => <>{value || "-"}</>,
    },
    {
      field: "qualification",
      headerName: "Qualification",
      flex: 1,
      renderCell: ({ value }) => <>{value || "-"}</>,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 130,
      renderCell: ({ value }) => <>{value || "-"}</>,
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
          onClick={() => navigate(`/teachers/${id}`)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/teachers/${id}/edit`)}
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
        title="Teachers"
        subtitle={`${teachers.length} teachers`}
        action={{ label: "Add Teacher", icon: <Add />, onClick: () => navigate("/teachers/new") }}
      />
      <DataGrid
        rows={teachers}
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
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher?"
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

export default TeacherList;
