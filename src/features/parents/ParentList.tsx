import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetParentsQuery, useDeleteParentMutation } from "../../app/api/parentsApi";
import { getErrorMessage } from "../../utils/helpers";

const ParentList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: parents = [], isLoading, error } = useGetParentsQuery();
  const [deleteParent] = useDeleteParentMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteParent(deleteId).unwrap();
      setSnackbar({ open: true, message: "Parent deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load parents" />;

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.user?.name}</>,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.user?.email}</>,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 130,
      renderCell: ({ value }) => <>{value || "-"}</>,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
      renderCell: ({ value }) => <>{value || "-"}</>,
    },
    {
      field: "students",
      headerName: "Children",
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
          onClick={() => navigate(`/parents/${id}`)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/parents/${id}/edit`)}
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
        title="Parents"
        subtitle={`${parents.length} parents`}
        action={{ label: "Add Parent", icon: <Add />, onClick: () => navigate("/parents/new") }}
      />
      <DataGrid
        rows={parents}
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
