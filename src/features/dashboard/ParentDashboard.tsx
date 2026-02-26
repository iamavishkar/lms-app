import React from "react";
import { Grid, Typography, Box, Card, CardContent } from "@mui/material";
import { School, EventNote, Assignment, Assessment } from "@mui/icons-material";
import StatsCard from "../../components/common/StatsCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetDashboardStatsQuery } from "../../app/api/dashboardApi";

const ParentDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load dashboard" />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Parent Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="My Children"
            value={stats?.totalStudents ?? 0}
            icon={<School sx={{ fontSize: 28 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Attendance Records"
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
            title="Results Available"
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
                Stay Informed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the sidebar to view your children&apos;s attendance, upcoming exams and results.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParentDashboard;
