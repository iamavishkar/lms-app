import React, { useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import { CloudUpload, InsertDriveFile, CheckCircle } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import NotificationSnackbar from '../../components/common/NotificationSnackbar';
import { useUploadFileMutation } from './fileApi';
import { getErrorMessage } from '../../utils/helpers';
import { FileUploadResponse } from '../../types';

const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const result = await uploadFile(formData).unwrap();
        setUploadedFiles((prev) => [...prev, result]);
        setSnackbar({ open: true, message: `${file.name} uploaded successfully`, severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <Box>
      <PageHeader title="File Upload" subtitle="Upload files to the system" />

      <Card
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          mb: 3,
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" mb={1}>
            Drag & drop files here, or click to select
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports all file types
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </CardContent>
      </Card>

      {isLoading && (
        <Box mb={2}>
          <Typography variant="body2" mb={1}>Uploading...</Typography>
          <LinearProgress />
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>Uploaded Files</Typography>
            <List dense>
              {uploadedFiles.map((file, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <InsertDriveFile color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.filename}
                    secondary={`Size: ${(file.size / 1024).toFixed(2)} KB`}
                  />
                  <CheckCircle color="success" />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {uploadedFiles.length === 0 && !isLoading && (
        <Alert severity="info">No files uploaded yet. Drag and drop or click to upload.</Alert>
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

export default FileUpload;
