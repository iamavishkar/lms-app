import React from "react";
import { Grid, Typography, Box, Card, CardContent } from "@mui/material";
import { EventNote, Assignment, Assessment, Class } from "@mui/icons-material";
import StatsCard from "../../components/common/StatsCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetDashboardStatsQuery } from "../../app/api/dashboardApi";

const StudentDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load dashboard" />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Student Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="My Classes"
            value={stats?.totalClasses ?? 0}
            icon={<Class sx={{ fontSize: 28 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Attendance"
            value={stats?.recentAttendance?.length ?? 0}
            icon={<EventNote sx={{ fontSize: 28 }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Upcoming Exams"
            value={stats?.upcomingExams?.length ?? 0}
            icon={<Assignment sx={{ fontSize: 28 }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="My Results"
            value={stats?.totalExams ?? 0}
            icon={<Assessment sx={{ fontSize: 28 }} />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Welcome to Your Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the sidebar to view your attendance, upcoming exams and results.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
