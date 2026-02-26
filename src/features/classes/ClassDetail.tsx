import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Button, Divider, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, ArrowBack } from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetClassByIdQuery } from "../../app/api/classesApi";

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cls, isLoading, error } = useGetClassByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !cls) return <ErrorAlert message="Failed to load class" />;

  const infoFields = [
    { label: "Class Name", value: cls.name, bold: true, md: 3 },
    { label: "Section", value: cls.section || "-", md: 3 },
    { label: "Academic Year", value: cls.academicYear, md: 3 },
    { label: "Class Teacher", value: cls.teacher?.user?.name || "-", md: 3 },
  ];

  const studentColumns: GridColDef[] = [
    { field: "enrollmentNumber", headerName: "Enrollment #", width: 160, renderCell: ({ value }) => <Chip label={value} size="small" /> },
    { field: "name", headerName: "Name", flex: 1, valueGetter: (_, row) => row.user?.name },
    { field: "gender", headerName: "Gender", width: 100, valueGetter: (value) => value || "-" },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/classes")} variant="outlined">
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Class Details
          </Typography>
        </Box>
        <Button startIcon={<Edit />} variant="contained" onClick={() => navigate(`/classes/${id}/edit`)}>
          Edit
        </Button>
      </Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {infoFields.map((f) => (
              <Grid item xs={12} md={f.md} key={f.label}>
                <Typography variant="caption" color="text.secondary">
                  {f.label}
                </Typography>
                <Typography fontWeight={f.bold ? "bold" : undefined}>{f.value}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      {cls.students && cls.students.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Students ({cls.students.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <DataGrid rows={cls.students} columns={studentColumns} autoHeight pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ClassDetail;
