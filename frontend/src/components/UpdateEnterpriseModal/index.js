import React, { useState, useEffect } from "react";
import { Modal, Box, IconButton, Typography, TextField, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";

const UpdateEnterpriseModal = ({ selectedEnterprise, enterprises, setEnterprises }) => {
    const [open, setOpen] = useState(false);
    const [newEnterpriseName, setNewEnterpriseName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Update the enterprise name in the input field when modal opens
    useEffect(() => {
        if (selectedEnterprise) {
            console.log(selectedEnterprise, 'selectedEnterprise');

            setNewEnterpriseName(selectedEnterprise?.name || "");
        }
    }, [selectedEnterprise]);

    const handleUpdateEnterprise = async () => {
        if (!selectedEnterprise || !newEnterpriseName.trim()) return;

        try {
            setLoading(true);
            const response = await axios.put(`${API_BASE_URL}${Endpoints?.UpdateEnterprise}${selectedEnterprise?.id}`, {
                name: newEnterpriseName,
            });

            if (response?.data?.success && response?.data?.message === 'Enterprise name updated successfully') {
                const updatedEnterprises = enterprises.map((enterprise) =>
                    enterprise._id === selectedEnterprise?.id
                        ? { ...enterprise, name: newEnterpriseName }
                        : enterprise
                );
                setEnterprises(updatedEnterprises);
                setOpen(false); // Close modal on success
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Failed to update enterprise. Please try again.");
            console.error("Error updating enterprise:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        if (selectedEnterprise) {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError(""); // Clear error message when closing modal
    };

    return (
        <>
            <IconButton aria-label="update" color="success" onClick={handleOpen}>
                <EditIcon />
            </IconButton>

            <Modal open={open} onClose={handleClose}>
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
                        onClick={handleClose}
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
                    <Typography variant="h6" gutterBottom sx={{ marginBottom: '15px' }}>
                        Update Enterprise Name
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <TextField
                        label="Enter Name"
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
                            onClick={handleUpdateEnterprise}
                            disabled={!newEnterpriseName.trim() || loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Update Name"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UpdateEnterpriseModal;
