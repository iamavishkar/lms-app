import React from "react";
import { Card, CardContent, Typography, Box, SxProps, Theme } from "@mui/material";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = "primary.main",
  sx,
}) => (
  <Card sx={{ height: "100%", ...sx }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatsCard;
