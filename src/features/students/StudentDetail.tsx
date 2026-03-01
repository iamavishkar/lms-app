import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetStudentByIdQuery } from "../../app/api/studentsApi";
import { formatDate } from "../../utils/helpers";

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading, error } = useGetStudentByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !student) return <ErrorAlert message="Failed to load student" />;

  const fields = [
    { label: "Date of Birth", value: formatDate(student.dateOfBirth), md: 4 },
    { label: "Gender", value: student.gender, md: 4 },
    { label: "Phone", value: student.phone || "-", md: 4 },
    {
      label: "Class",
      value: student.class ? `${student.class.name} ${student.class.section || ""}` : "-",
      md: 4,
    },
    { label: "Address", value: student.address || "-", md: 4 },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/students")}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Student Profile
          </Typography>
        </Box>
        <Button
          startIcon={<Edit />}
          variant="contained"
          onClick={() => navigate(`/students/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 28 }}>
              {student.user?.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{`${student.user?.firstName} ${student.user?.lastName}`}</Typography>
              <Typography variant="body2" color="text.secondary">
                {student.user?.email}
              </Typography>
              <Chip label={student.enrollmentNumber} size="small" sx={{ mt: 0.5 }} />
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
          <Divider sx={{ my: 2 }} />
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/students/${id}/attendance`)}
            >
              View Attendance
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/students/${id}/results`)}
            >
              View Results
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentDetail;
