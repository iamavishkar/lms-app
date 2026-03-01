import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Skeleton,
  Chip,
} from "@mui/material";
import { EventNote, Assignment, Assessment, Class } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import StatsCard from "../../components/common/StatsCard";
import ErrorAlert from "../../components/common/ErrorAlert";
import {
  useGetMyStudentCoursesQuery,
  useGetMyCourseAttendanceQuery,
  useGetMyStudentResultsQuery,
} from "../../app/api/studentsApi";
import { formatDate, calculateGrade } from "../../utils/helpers";

interface Course {
  id: number;
  name: string;
  code?: string;
}

const statusColor: Record<string, "success" | "error" | "warning"> = {
  present: "success",
  absent: "error",
  late: "warning",
};

const attendanceColumns: GridColDef[] = [
  {
    field: "date",
    headerName: "Date",
    width: 130,
    renderCell: ({ value }) => <>{formatDate(value as string)}</>,
  },
  {
    field: "status",
    headerName: "Status",
    width: 110,
    renderCell: ({ value }) => (
      <Chip label={value} size="small" color={statusColor[value as string] ?? "default"} />
    ),
  },
];

const resultColumns: GridColDef[] = [
  {
    field: "exam",
    headerName: "Exam",
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => <>{row.exam?.name}</>,
  },
  { field: "marksObtained", headerName: "Marks", width: 90 },
  {
    field: "grade",
    headerName: "Grade",
    width: 80,
    renderCell: ({ row }) => {
      const grade = row.grade || calculateGrade(row.marksObtained, row.exam?.totalMarks ?? 100);
      return (
        <Chip
          label={grade}
          size="small"
          color={grade === "F" ? "error" : grade.startsWith("A") ? "success" : "primary"}
        />
      );
    },
  },
];

const StudentDashboard: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");

  const {
    data: courses = [],
    isLoading: loadingCourses,
    error: coursesError,
  } = useGetMyStudentCoursesQuery();
  const courseList = courses as Course[];

  const { data: attendance = [], isLoading: loadingAttendance } = useGetMyCourseAttendanceQuery(
    selectedCourseId as number,
    { skip: !selectedCourseId }
  );
  const attendanceList = attendance as Array<{ id: number; date: string; status: string }>;

  const { data: results = [], isLoading: loadingResults } = useGetMyStudentResultsQuery();
  const resultList = results as Array<{
    id: number;
    marksObtained: number;
    grade?: string;
    exam?: { name: string; totalMarks: number };
  }>;

  const presentCount = attendanceList.filter((a) => a.status === "present").length;
  const absentCount = attendanceList.filter((a) => a.status === "absent").length;
  const attendancePct =
    attendanceList.length > 0 ? Math.round((presentCount / attendanceList.length) * 100) : 0;

  if (coursesError) return <ErrorAlert message="Failed to load courses" />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Student Dashboard
      </Typography>

      {/* Summary stats */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="My Courses"
            value={courseList.length}
            icon={<Class sx={{ fontSize: 28 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Present"
            value={presentCount}
            icon={<EventNote sx={{ fontSize: 28 }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Absent"
            value={absentCount}
            icon={<Assignment sx={{ fontSize: 28 }} />}
            color="#d32f2f"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Attendance %"
            value={selectedCourseId ? `${attendancePct}%` : "—"}
            icon={<Assessment sx={{ fontSize: 28 }} />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Course selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {loadingCourses ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <TextField
              select
              label="Select Course to View Attendance"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(Number(e.target.value) || "")}
              fullWidth
              size="small"
            >
              <MenuItem value="">-- Select a course --</MenuItem>
              {courseList.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                  {course.code ? ` (${course.code})` : ""}
                </MenuItem>
              ))}
            </TextField>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Attendance DataGrid */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Course Attendance
              </Typography>
              {!selectedCourseId ? (
                <Typography variant="body2" color="text.secondary">
                  Select a course above to view attendance records.
                </Typography>
              ) : (
                <DataGrid
                  rows={attendanceList}
                  columns={attendanceColumns}
                  loading={loadingAttendance}
                  autoHeight
                  pageSizeOptions={[10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  disableRowSelectionOnClick
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Results DataGrid */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                My Results
              </Typography>
              <DataGrid
                rows={resultList}
                columns={resultColumns}
                loading={loadingResults}
                autoHeight
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                disableRowSelectionOnClick
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
