import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Divider } from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useGetUserByIdQuery } from "../../app/api/usersApi";
import { formatDate } from "../../utils/helpers";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserByIdQuery(Number(id));

  if (isLoading) return <LoadingSpinner />;
  if (error || !user) return <ErrorAlert message="Failed to load user" />;

  const textFields = [
    { label: "Name", value: user.name, bold: true, md: 6 },
    { label: "Email", value: user.email, md: 6 },
    { label: "Created At", value: formatDate(user.createdAt), md: 6 },
    { label: "Updated At", value: formatDate(user.updatedAt), md: 6 },
  ];

  const chipFields = [
    {
      label: "Role",
      node: <Chip label={user.role?.name} color="primary" variant="outlined" />,
      md: 6,
    },
    {
      label: "Status",
      node: (
        <Chip
          label={user.isActive ? "Active" : "Inactive"}
          color={user.isActive ? "success" : "default"}
        />
      ),
      md: 6,
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/users")} variant="outlined">
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            User Details
          </Typography>
        </Box>
        <Button
          startIcon={<Edit />}
          variant="contained"
          onClick={() => navigate(`/users/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {textFields.slice(0, 2).map((f) => (
              <Grid size={{ xs: 12, md: f.md }} key={f.label}>
                <Typography variant="caption" color="text.secondary">
                  {f.label}
                </Typography>
                <Typography variant="body1" fontWeight={f.bold ? "bold" : undefined}>
                  {f.value}
                </Typography>
              </Grid>
            ))}
            <Grid size={12}>
              <Divider />
            </Grid>
            {chipFields.map((f) => (
              <Grid size={{ xs: 12, md: f.md }} key={f.label}>
                <Typography variant="caption" color="text.secondary">
                  {f.label}
                </Typography>
                <Box mt={0.5}>{f.node}</Box>
              </Grid>
            ))}
            <Grid size={12}>
              <Divider />
            </Grid>
            {textFields.slice(2).map((f) => (
              <Grid size={{ xs: 12, md: f.md }} key={f.label}>
                <Typography variant="caption" color="text.secondary">
                  {f.label}
                </Typography>
                <Typography variant="body1">{f.value}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetail;
