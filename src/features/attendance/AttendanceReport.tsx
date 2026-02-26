import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetAttendanceQuery } from "../../app/api/attendanceApi";
import { useGetStudentsQuery } from "../../app/api/studentsApi";
import { useGetClassesQuery } from "../../app/api/classesApi";
import { formatDate } from "../../utils/helpers";
import { AttendanceStatus } from "../../interfaces";

const statusColor: Record<AttendanceStatus, "success" | "error" | "warning"> = {
  present: "success",
  absent: "error",
  late: "warning",
};

const AttendanceReport: React.FC = () => {
  const [filterClass, setFilterClass] = useState("");
  const [filterStudent, setFilterStudent] = useState("");

  const { data: attendance, isLoading, error } = useGetAttendanceQuery();
  const { data: students } = useGetStudentsQuery();
  const { data: classes } = useGetClassesQuery();

  const filtered =
    attendance?.filter((a) => {
      if (filterClass && a.class?.id !== Number(filterClass)) return false;
      if (filterStudent && a.student?.id !== Number(filterStudent)) return false;
      return true;
    }) ?? [];

  const summary = {
    total: filtered.length,
    present: filtered.filter((a) => a.status === "present").length,
    absent: filtered.filter((a) => a.status === "absent").length,
    late: filtered.filter((a) => a.status === "late").length,
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load attendance" />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Attendance Report
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Filter by Class"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="">All Classes</MenuItem>
                {classes?.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} {c.section}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Filter by Student"
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="">All Students</MenuItem>
                {students?.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.user?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold">
                {summary.total}
              </Typography>
              <Typography color="text.secondary">Total</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {summary.present}
              </Typography>
              <Typography color="text.secondary">Present</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {summary.absent}
              </Typography>
              <Typography color="text.secondary">Absent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {summary.late}
              </Typography>
              <Typography color="text.secondary">Late</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id} hover>
                <TableCell>{formatDate(a.date)}</TableCell>
                <TableCell>{a.student?.user?.name}</TableCell>
                <TableCell>{a.class?.name}</TableCell>
                <TableCell>
                  <Chip
                    label={a.status}
                    size="small"
                    color={statusColor[a.status as AttendanceStatus] ?? "default"}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceReport;
