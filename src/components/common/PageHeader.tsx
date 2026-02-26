import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <Box mb={3}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Button variant="contained" startIcon={action.icon} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
    <Divider sx={{ mt: 2 }} />
  </Box>
);

export default PageHeader;
