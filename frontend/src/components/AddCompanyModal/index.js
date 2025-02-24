import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Modal,
    Typography,
    IconButton,
    Grid,
    TextField,
    CircularProgress,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import SnackbarAlert from "../Alerts";

function AddCompanyModal({ enterprises, setEnterprises }) {

    const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);
    const [newEnterpriseName, setNewEnterpriseName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [alertStatus, setAlertStatus] = useState({ open: false, message: '', severity: 'success', position: { vertical: 'top', horizontal: 'right' } });

    const handleOpenAddCompanyModal = () => {
        setAddCompanyModalOpen(true);
    };

    const handleCloseAddCompanyModal = () => {
        setAddCompanyModalOpen(false);
        setError("");
    };

    const handleAddNewEnterprise = async () => {
        if (!newEnterpriseName.trim()) return;

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}${Endpoints?.AddEnterprise}`, {
                name: newEnterpriseName,
            });


            if (response?.data?.message === 'Enterprise added successfully' && response?.data?.enterprise) {
                generateAlert('Enterprise added successfully', 'success');
                const newEnterprise = response.data.enterprise;
                setEnterprises([...enterprises, { ...newEnterprise, id: newEnterprise._id }]);
                setNewEnterpriseName("");
            }

            handleCloseAddCompanyModal();
        } catch (err) {
            generateAlert('Failed to add enterprise. Please try again.', 'error');
            setError(
                err.response?.data?.message || "Failed to add enterprise. Please try again."
            );
            console.error("Error adding enterprise:", err);
        } finally {
            setLoading(false);
        }
    };

    const generateAlert = (message, severity) => {
        const obj = { open: true, message, severity };
        setAlertStatus(obj)
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertStatus({ open: false, message: '', severity: '' })
    }

    return (
        <>
            <SnackbarAlert
                message={alertStatus.message}
                severity={alertStatus.severity}
                open={alertStatus.open}
                autoHideDuration={1200}
                onClose={handleAlertClose}
                position={alertStatus.position}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddCompanyModal}
                sx={{ float: "right", marginBottom: "10px" }}
            >
                Add New Enterprise
            </Button>
            <Modal open={addCompanyModalOpen} onClose={handleCloseAddCompanyModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <IconButton
                        edge="end"
                        aria-label="close"
                        onClick={handleCloseAddCompanyModal}
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            color: "gray",
                            backgroundColor: "white",
                            borderRadius: "50%",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        Add New Company
                    </Typography>
                    <TextField
                        label="Company Name"
                        variant="outlined"
                        fullWidth
                        value={newEnterpriseName}
                        onChange={(e) => setNewEnterpriseName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddNewEnterprise}
                            disabled={!newEnterpriseName.trim() || loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Add Company"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}


export default AddCompanyModal;