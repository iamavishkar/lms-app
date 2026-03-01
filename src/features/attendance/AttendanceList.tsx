import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Add, Delete } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetAttendanceQuery, useDeleteAttendanceMutation } from "../../app/api/attendanceApi";
import { getErrorMessage, formatDate } from "../../utils/helpers";
import { usePermissions } from "../../hooks/usePermissions";

const statusColor: Record<string, "success" | "error" | "warning"> = {
  present: "success",
  absent: "error",
  late: "warning",
};

const AttendanceList: React.FC = () => {
  const navigate = useNavigate();
  const { canMarkAttendance } = usePermissions();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: attendance = [], isLoading, error } = useGetAttendanceQuery();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAttendance(deleteId).unwrap();
      setSnackbar({ open: true, message: "Attendance record deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
    setDeleteId(null);
  };

  if (error) return <ErrorAlert message="Failed to load attendance" />;

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: ({ value }) => <>{formatDate(value)}</>,
    },
    {
      field: "student",
      headerName: "Student",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <>{row.student?.user?.name}</>,
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
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color={statusColor[value] ?? "default"} />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => [
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
        title="Attendance"
        subtitle={`${attendance.length} records`}
        action={
          canMarkAttendance
            ? {
                label: "Mark Attendance",
                icon: <Add />,
                onClick: () => navigate("/attendance/mark"),
              }
            : undefined
        }
      />
      <DataGrid
        rows={attendance}
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
