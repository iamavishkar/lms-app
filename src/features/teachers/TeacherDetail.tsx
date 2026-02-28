import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Button, Divider, Avatar } from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetTeacherByIdQuery } from "../../app/api/teachersApi";

const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: teacher, isLoading, error } = useGetTeacherByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !teacher) return <ErrorAlert message="Failed to load teacher" />;

  const fields = [
    { label: "Qualification", value: teacher.qualification || "-", md: 4 },
    { label: "Specialization", value: teacher.specialization || "-", md: 4 },
    { label: "Phone", value: teacher.phone || "-", md: 4 },
    { label: "Address", value: teacher.address || "-", md: 12 },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/teachers")}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Teacher Profile
          </Typography>
        </Box>
        <Button
          startIcon={<Edit />}
          variant="contained"
          onClick={() => navigate(`/teachers/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: "secondary.main", fontSize: 28 }}>
              {teacher.user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{teacher.user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {teacher.user?.email}
              </Typography>
              <Typography variant="caption" color="primary">
                ID: {teacher.employeeId}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {fields.map((f) => (
              <Grid size={{ xs: 12, md: f.md }} key={f.label}>
                <Typography variant="caption" color="text.secondary">
                  {f.label}
                </Typography>
                <Typography>{f.value}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeacherDetail;
