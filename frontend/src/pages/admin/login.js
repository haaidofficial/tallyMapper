import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Snackbar, // Import Snackbar
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import styles from "./style.module.css";
import { BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter for redirecting
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = () => {
  const router = useRouter(); // Initialize the router to navigate to the dashboard

  // State for form inputs and error messages
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // "success" or "error"
  });
  const [showPassword, setShowPassword] = useState(false);

  // Input validation
  const validateInputs = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateInputs()) return;

    try {
      const response = await axios.post(`${BASE_URL}${Endpoints.Login}`, formData);
      const { token, id, name, email } = response.data; // Destructure the response

      // Check if token is present in the response
      if (token) {
        // Store the JWT token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ id, name, email }));

        // Show success message
        setSnackbar({
          open: true,
          message: response.data.message || "Login successful!",
          severity: "success",
        });

        // Redirect to dashboard
        router.push("/admin/dashboard");
      } else {
        // If no token, show error message
        setSnackbar({
          open: true,
          message: "Authentication failed. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "An error occurred during login",
        severity: "error",
      });
    }
  };


  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.formContainer}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
        }}
      >
        {/* Form Header */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#333",
          }}
        >
          Admin Login
        </Typography>

        {/* Form */}
        <Box
          component="form"
          sx={{
            width: "100%",
            mt: 2,
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {/* Email Input */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          />

          {/* Password Input */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            slotProps={
              {
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }
            }
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <IconButton
            //         onClick={togglePasswordVisibility}
            //         edge="end"
            //       >
            //         {showPassword ? <VisibilityOff /> : <Visibility />}
            //       </IconButton>
            //     </InputAdornment>
            //   ),
            // }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: "#1abc9c",
              borderRadius: "8px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#16a085",
              },
            }}
          >
            LOGIN
          </Button>
          {/* <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography sx={{ mt: 1, color: "#333" }}>
              Don't have an account?{" "}
              <Link href="/admin/register" style={{ color: "#1abc9c" }}>
                Register here
              </Link>
            </Typography>
          </Box> */}
        </Box>
      </Container>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        onClose={handleSnackbarClose}
        autoHideDuration={3000} // Auto close after 3 seconds
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLogin;
