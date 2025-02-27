import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import styles from "../../styles/style.module.css";
import { API_BASE_URL, BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import Link from "next/link";
import { useRouter } from "next/router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";

const AdminLogin = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${Endpoints.Login}`, data);
      const { token, id, name, email } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ id, name, email }));

        setSnackbar({
          open: true,
          message: response.data.message || "Login successful!",
          severity: "success",
        });

        router.push("/home");
      } else {
        setSnackbar({
          open: true,
          message: "Authentication failed. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "An error occurred during login",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.formContainer}>
      <Container
        maxWidth="sm" sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;",
        }}
        className={styles.formWrapper}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#5C7285" }} className={styles.formWrapperHd}>
          Admin Login
        </Typography>

        <Box component="form" sx={{ width: "100%", mt: 2 }} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email address",
              },
            })}
            variant="outlined"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "5px",
            }}
          />

          <TextField
            fullWidth
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "5px",
            }}
          />

          <Button type="submit" fullWidth variant="contained" sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: "#5C7285",
            borderRadius: "8px",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#5C7285" },
          }}>
            LOGIN
          </Button>
        </Box>
      </Container>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={snackbar.open} onClose={handleSnackbarClose} autoHideDuration={3000}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLogin;
