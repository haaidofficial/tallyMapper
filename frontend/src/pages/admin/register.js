// import React, { useState } from "react";
// import {
//     Box,
//     Button,
//     TextField,
//     Typography,
//     Container,
//     Snackbar,
//     Alert,
// } from "@mui/material";
// import axios from "axios";
// import styles from "./style.module.css";
// import { BASE_URL, Endpoints } from "@/constants/apiEndpoints";
// import Link from "next/link";

// const AdminRegistration = () => {
//     // State for form inputs and errors
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });
//     const [errors, setErrors] = useState({});

//     // Snackbar state
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: "",
//         severity: "info", // "success" or "error"
//     });

//     // Input validation
//     const validateInputs = () => {
//         const newErrors = {};
//         if (!formData.name.trim()) newErrors.name = "Name is required";
//         if (!formData.email.trim()) {
//             newErrors.email = "Email is required";
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = "Invalid email address";
//         }
//         if (!formData.password.trim()) {
//             newErrors.password = "Password is required";
//         } else if (formData.password.length < 6) {
//             newErrors.password = "Password must be at least 6 characters";
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});

//         if (!validateInputs()) return;

//         try {
//             const response = await axios.post(`${BASE_URL}${Endpoints.SignUp}`, formData);
//             setSnackbar({
//                 open: true,
//                 message: response.data.message || "Registration successful!",
//                 severity: "success",
//             });
//             setFormData({ name: "", email: "", password: "" });
//         } catch (error) {
//             setSnackbar({
//                 open: true,
//                 message:
//                     error.response?.data?.message || "An error occurred during registration",
//                 severity: "error",
//             });
//         }
//     };

//     // Handle input change
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Close Snackbar
//     const handleSnackbarClose = () => {
//         setSnackbar((prev) => ({ ...prev, open: false }));
//     };

//     return (
//         <div className={styles.formContainer}>
//             <Container
//                 maxWidth="sm"
//                 sx={{
//                     mt: 8,
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     backgroundColor: "#f9f9f9",
//                     padding: "2rem",
//                     borderRadius: "8px",
//                     boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//                 }}
//             >
//                 {/* Form Header */}
//                 <Typography
//                     variant="h5"
//                     sx={{
//                         fontWeight: "bold",
//                         mb: 2,
//                         color: "#333",
//                     }}
//                 >
//                     Admin Registration
//                 </Typography>

//                 {/* Form */}
//                 <Box
//                     component="form"
//                     sx={{
//                         width: "100%",
//                         mt: 2,
//                     }}
//                     noValidate
//                     autoComplete="off"
//                     onSubmit={handleSubmit}
//                 >
//                     {/* Name Input */}
//                     <TextField
//                         fullWidth
//                         label="Name"
//                         name="name"
//                         variant="outlined"
//                         margin="normal"
//                         value={formData.name}
//                         onChange={handleChange}
//                         error={!!errors.name}
//                         helperText={errors.name}
//                         sx={{
//                             backgroundColor: "#fff",
//                             borderRadius: "8px",
//                             "& .MuiOutlinedInput-notchedOutline": {
//                                 border: "none",
//                             },
//                         }}
//                     />

//                     {/* Email Input */}
//                     <TextField
//                         fullWidth
//                         label="Email"
//                         name="email"
//                         variant="outlined"
//                         margin="normal"
//                         value={formData.email}
//                         onChange={handleChange}
//                         error={!!errors.email}
//                         helperText={errors.email}
//                         sx={{
//                             backgroundColor: "#fff",
//                             borderRadius: "8px",
//                             "& .MuiOutlinedInput-notchedOutline": {
//                                 border: "none",
//                             },
//                         }}
//                     />

//                     {/* Password Input */}
//                     <TextField
//                         fullWidth
//                         label="Password"
//                         name="password"
//                         type="password"
//                         variant="outlined"
//                         margin="normal"
//                         value={formData.password}
//                         onChange={handleChange}
//                         error={!!errors.password}
//                         helperText={errors.password}
//                         sx={{
//                             backgroundColor: "#fff",
//                             borderRadius: "8px",
//                             "& .MuiOutlinedInput-notchedOutline": {
//                                 border: "none",
//                             },
//                         }}
//                     />

//                     {/* Submit Button */}
//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         sx={{
//                             mt: 3,
//                             py: 1.5,
//                             backgroundColor: "#1abc9c",
//                             borderRadius: "8px",
//                             fontWeight: "bold",
//                             "&:hover": {
//                                 backgroundColor: "#16a085",
//                             },
//                         }}
//                     >
//                         REGISTER
//                     </Button>

//                     {/* Login Link */}
//                     <Box sx={{ mt: 2, textAlign: "center" }} >

//                         <Typography
//                             sx={{ mt: 1, color: "#333" }}
//                         >
//                             Already have an account? {' '}
//                             <Link href="/admin/login" style={{ color: "#1abc9c", }}>
//                                 Login here
//                             </Link>
//                         </Typography>

//                     </Box>
//                 </Box>
//             </Container>

//             {/* Snackbar */}
//             <Snackbar
//                 anchorOrigin={{ vertical: "top", horizontal: "center" }}
//                 open={snackbar.open}
//                 onClose={handleSnackbarClose}
//                 autoHideDuration={3000} // Auto close after 3 seconds
//                 key={"topcenter"}
//             >
//                 <Alert
//                     onClose={handleSnackbarClose}
//                     severity={snackbar.severity}
//                     sx={{ width: "100%" }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </div>
//     );
// };

// export default AdminRegistration;

export default function AdminRegistration() {
    return null;
}

export async function getServerSideProps() {
    return {
        notFound: true,
    };
}