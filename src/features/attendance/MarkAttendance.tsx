import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";
import { useGetClassesQuery } from "../../app/api/classesApi";
import { useGetStudentsQuery } from "../../app/api/studentsApi";
import { useMarkAttendanceMutation } from "../../app/api/attendanceApi";
import { AttendanceStatus } from "../../interfaces";
import { getErrorMessage } from "../../utils/helpers";

interface AttendanceRecord {
  studentId: number;
  status: AttendanceStatus;
}

const MarkAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: classes } = useGetClassesQuery();
  const { data: students, isLoading: loadingStudents } = useGetStudentsQuery();
  const [markAttendance, { isLoading }] = useMarkAttendanceMutation();

  const classStudents = students?.filter((s) => s.class?.id === Number(selectedClass)) ?? [];

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    const filteredStudents = students?.filter((s) => s.class?.id === Number(classId)) ?? [];
    setRecords(
      filteredStudents.map((s) => ({ studentId: s.id, status: "present" as AttendanceStatus }))
    );
  };

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setRecords((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !date) return;
    try {
      await markAttendance({ date, classId: Number(selectedClass), attendances: records }).unwrap();
      setSnackbar({ open: true, message: "Attendance marked successfully", severity: "success" });
      setTimeout(() => navigate("/attendance"), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err), severity: "error" });
    }
  };

  return (
    <Box>
      <PageHeader title="Mark Attendance" />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Select Class"
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                fullWidth
              >
                {classes?.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} {c.section}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {selectedClass && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Students ({classStudents.length})
            </Typography>
            {loadingStudents ? (
              <LoadingSpinner />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Enrollment #</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classStudents.map((student) => {
                    const record = records.find((r) => r.studentId === student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.user?.name}</TableCell>
                        <TableCell>{student.enrollmentNumber}</TableCell>
                        <TableCell>
                          <FormControl>
                            <RadioGroup
                              row
                              value={record?.status ?? "present"}
                              onChange={(e) =>
                                handleStatusChange(student.id, e.target.value as AttendanceStatus)
                              }
                            >
                              <FormControlLabel
                                value="present"
                                control={<Radio color="success" size="small" />}
                                label="Present"
                              />
                              <FormControlLabel
                                value="absent"
                                control={<Radio color="error" size="small" />}
                                label="Absent"
                              />
                              <FormControlLabel
                                value="late"
                                control={<Radio color="warning" size="small" />}
                                label="Late"
                              />
                            </RadioGroup>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading || records.length === 0}
              >
                {isLoading ? <CircularProgress size={20} /> : "Submit Attendance"}
              </Button>
              <Button variant="outlined" onClick={() => navigate("/attendance")}>
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
};

export default MarkAttendance;
