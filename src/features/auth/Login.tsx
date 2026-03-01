import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, School } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginMutation } from "../../app/api/authApi";
import { setCredentials } from "./authSlice";
import { LoginCredentials } from "../../interfaces";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const result = await login(data).unwrap();      
      dispatch(setCredentials({ user: result.user, token: result.access_token }));
      navigate("/dashboard");
    } catch {
      // error handled by RTK Query
    }
  };

  const errorMessage =
    error && "data" in error
      ? (error.data as { message?: string })?.message || "Login failed"
      : error
        ? "Login failed"
        : null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <School sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              LMS Portal
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Sign in to your account
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register("email")}
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              autoFocus
            />
            <TextField
              {...register("password")}
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <RouterLink to="/register" style={{ color: "#1976d2" }}>
                  Register
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
