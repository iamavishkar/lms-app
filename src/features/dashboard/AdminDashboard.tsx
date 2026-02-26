import React from 'react';
import { Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { People, School, SupervisorAccount, FamilyRestroom, Class, Subject } from '@mui/icons-material';
import StatsCard from '../../components/common/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useGetDashboardStatsQuery } from './dashboardApi';
import { formatDate } from '../../utils/helpers';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load dashboard stats" />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatsCard
            title="Total Students"
            value={stats?.totalStudents ?? 0}
            icon={<School sx={{ fontSize: 28 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatsCard
            title="Total Teachers"
            value={stats?.totalTeachers ?? 0}
            icon={<SupervisorAccount sx={{ fontSize: 28 }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatsCard
            title="Total Parents"
            value={stats?.totalParents ?? 0}
            icon={<FamilyRestroom sx={{ fontSize: 28 }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatsCard
            title="Total Classes"
            value={stats?.totalClasses ?? 0}
            icon={<Class sx={{ fontSize: 28 }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatsCard
            title="Total Subjects"
            value={stats?.totalSubjects ?? 0}
            icon={<Subject sx={{ fontSize: 28 }} />}
            color="#0288d1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatsCard
            title="Total Exams"
            value={stats?.totalExams ?? 0}
            icon={<People sx={{ fontSize: 28 }} />}
            color="#c62828"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {stats?.upcomingExams && stats.upcomingExams.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Upcoming Exams
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Exam</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.upcomingExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.name}</TableCell>
                        <TableCell>{exam.subject?.name}</TableCell>
                        <TableCell>{formatDate(exam.date)}</TableCell>
                        <TableCell>
                          <Chip label={exam.type} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}

        {stats?.recentAttendance && stats.recentAttendance.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Recent Attendance
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Present</TableCell>
                      <TableCell>Absent</TableCell>
                      <TableCell>Late</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentAttendance.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{formatDate(row.date)}</TableCell>
                        <TableCell>
                          <Chip label={row.present} color="success" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={row.absent} color="error" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={row.late} color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
