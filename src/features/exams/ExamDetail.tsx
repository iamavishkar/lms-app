import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Divider } from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetExamByIdQuery } from "../../app/api/examsApi";
import { formatDate } from "../../utils/helpers";

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: exam, isLoading, error } = useGetExamByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !exam) return <ErrorAlert message="Failed to load exam" />;

  const fields = [
    { label: "Exam Name", value: exam.name, bold: true, md: 6 },
    { label: "Type", value: <Chip label={exam.type} />, md: 6 },
    { label: "Subject", value: exam.subject?.name, md: 3 },
    { label: "Class", value: exam.class?.name, md: 3 },
    { label: "Date", value: formatDate(exam.date), md: 3 },
    { label: "Duration", value: `${exam.duration} minutes`, md: 3 },
    { label: "Total Marks", value: exam.totalMarks, bold: true, md: 3 },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/exams")} variant="outlined">
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Exam Details
          </Typography>
        </Box>
        <Button
          startIcon={<Edit />}
          variant="contained"
          onClick={() => navigate(`/exams/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {fields.map((f, i) => (
              <React.Fragment key={i}>
                {f.label === "Subject" && (
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: f.md }}>
                  <Typography variant="caption" color="text.secondary">
                    {f.label}
                  </Typography>
                  {typeof f.value === "string" || typeof f.value === "number" ? (
                    <Typography fontWeight={f.bold ? "bold" : undefined}>{f.value}</Typography>
                  ) : (
                    <Box mt={0.5}>{f.value}</Box>
                  )}
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExamDetail;
