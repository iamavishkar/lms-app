import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetRolesQuery, useDeleteRoleMutation } from "../../app/api/rolesApi";
import { getErrorMessage } from "../../utils/helpers";

const RoleList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const { data: roles = [], isLoading, error } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRole(deleteId).unwrap();
      setSnackbar({ open: true, message: "Role deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load roles" />;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2, valueGetter: (value) => value || "-" },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => [
        <GridActionsCellItem key="edit" icon={<Edit />} label="Edit" onClick={() => navigate(`/roles/${id}/edit`)} />,
        <GridActionsCellItem key="delete" icon={<Delete />} label="Delete" onClick={() => setDeleteId(id as number)} color="error" />,
      ],
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Role Management"
        subtitle={`${roles.length} roles`}
        action={{ label: "Add Role", icon: <Add />, onClick: () => navigate("/roles/new") }}
      />
      <DataGrid
        rows={roles}
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
        title="Delete Role"
        message="Are you sure you want to delete this role?"
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

export default RoleList;
