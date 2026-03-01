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
} from "@mui/material";
import { School, EventNote, Assignment, Assessment } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import StatsCard from "../../components/common/StatsCard";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetMyChildrenQuery } from "../../app/api/parentsApi";
import { useGetStudentAttendanceQuery, useGetStudentResultsQuery } from "../../app/api/studentsApi";
import { formatDate, calculateGrade } from "../../utils/helpers";

interface ChildOption {
  id: number;
  name: string;
  class?: { name: string; section?: string };
}

const attendanceColumns: GridColDef[] = [
  {
    field: "date",
    headerName: "Date",
    width: 120,
    renderCell: ({ value }) => <>{formatDate(value as string)}</>,
  },
  { field: "status", headerName: "Status", width: 100 },
  {
    field: "subject",
    headerName: "Subject",
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => <>{row.subject?.name ?? "-"}</>,
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
    renderCell: ({ row }) => <>{row.grade || calculateGrade(row.marksObtained, row.exam?.totalMarks ?? 100)}</>,
  },
];

const ParentDashboard: React.FC = () => {
  const [selectedChildId, setSelectedChildId] = useState<number | "">("");

  const { data: children = [], isLoading: loadingChildren, error: childrenError } = useGetMyChildrenQuery();
  const childList = children as ChildOption[];
  const selectedChild = childList.find((c) => c.id === selectedChildId);

  const { data: attendance = [], isLoading: loadingAttendance } = useGetStudentAttendanceQuery(
    selectedChildId as number,
    { skip: !selectedChildId }
  );
  const attendanceList = attendance as Array<{ id: number; date: string; status: string; subject?: { name: string } }>;

  const { data: results = [], isLoading: loadingResults } = useGetStudentResultsQuery(
    selectedChildId as number,
    { skip: !selectedChildId }
  );
  const resultList = results as Array<{ id: number; marksObtained: number; grade?: string; exam?: { name: string; totalMarks: number } }>;

  const presentCount = attendanceList.filter((a) => a.status === "present").length;
  const absentCount = attendanceList.filter((a) => a.status === "absent").length;
  const attendancePct = attendanceList.length > 0 ? Math.round((presentCount / attendanceList.length) * 100) : 0;

  if (childrenError) return <ErrorAlert message="Failed to load children data" />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Parent Dashboard
      </Typography>

      {/* Child selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {loadingChildren ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <TextField
              select
              label="Select Child"
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(Number(e.target.value) || "")}
              fullWidth
              size="small"
            >
              <MenuItem value="">-- Select a child --</MenuItem>
              {childList.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.name}
                  {child.class ? ` — ${child.class.name} ${child.class.section ?? ""}` : ""}
                </MenuItem>
              ))}
            </TextField>
          )}
          {selectedChild && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Class:{" "}
              {selectedChild.class
                ? `${selectedChild.class.name} ${selectedChild.class.section ?? ""}`
                : "N/A"}
            </Typography>
          )}
        </CardContent>
      </Card>

      {selectedChildId ? (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard
                title="Total Records"
                value={attendanceList.length}
                icon={<EventNote sx={{ fontSize: 28 }} />}
                color="#1976d2"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard
                title="Present"
                value={presentCount}
                icon={<School sx={{ fontSize: 28 }} />}
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
                value={`${attendancePct}%`}
                icon={<Assessment sx={{ fontSize: 28 }} />}
                color="#ed6c02"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Recent Attendance
                  </Typography>
                  <DataGrid
                    rows={attendanceList}
                    columns={attendanceColumns}
                    loading={loadingAttendance}
                    autoHeight
                    pageSizeOptions={[5, 10]}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    disableRowSelectionOnClick
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Exam Results
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
        </>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Select a child above to view their attendance and results.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ParentDashboard;
