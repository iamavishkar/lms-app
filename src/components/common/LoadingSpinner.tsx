import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', fullHeight = false }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight={fullHeight ? '60vh' : 200}
    gap={2}
  >
    <CircularProgress />
    <Typography color="text.secondary">{message}</Typography>
  </Box>
);

export default LoadingSpinner;
