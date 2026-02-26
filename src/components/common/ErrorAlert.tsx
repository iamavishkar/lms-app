import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorAlertProps {
  message?: string;
  title?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message = 'An error occurred', title = 'Error' }) => (
  <Box sx={{ p: 2 }}>
    <Alert severity="error">
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  </Box>
);

export default ErrorAlert;
