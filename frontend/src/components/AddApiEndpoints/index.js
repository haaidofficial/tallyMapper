import React, { useState, useEffect, useRef } from "react";
import { Modal, Box, IconButton, Typography, TextField, Button, CircularProgress, List, Grid, Select, MenuItem, ListItem, Dialog, DialogTitle, DialogActions, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import { Controller, useForm } from "react-hook-form";
import SnackbarAlert from "../Alerts";

const AddApiEndpointsComp = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [inputs, setInputs] = useState([{ api: "", method: "get" }]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [alertStatus, setAlertStatus] = useState({ open: false, message: '', severity: 'success', position: { vertical: 'top', horizontal: 'right' } });
    const selectedApiId = useRef('')

    const maxInputs = 8;

    const { control, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleChange = (index, field, value) => {
        setInputs(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });

        setValue(`inputs.${index}.${field}`, value);
    };

    const handleAddInput = () => {
        if (inputs.length < maxInputs) {
            setInputs([...inputs, { api: "", method: "get" }]);
        }
    };


    useEffect(() => {
        fetchApiEndpoints();
    }, []);


    const fetchApiEndpoints = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetAllApiEndpoints}`);
            if (response.data.status === 200) {
                setEndpoints(response.data?.data?.apiEndpoints);
            }
        } catch (error) {
            generateAlert('Error fetching API endpoints', 'error');
            console.error("Error fetching API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEndpoint = async () => {
        const validInputs = inputs.filter(input => input.api && input.method);
        if (validInputs.length === 0) return;

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}${Endpoints?.AddApiEndpointsList}`,
                { apiEndpoints: validInputs }
            );

            if (response.data?.success && response.data?.message === 'Api Endpoints added successfully') {
                generateAlert('New Api Endpoint Added globally', 'success');
                setEndpoints([...endpoints, ...validInputs]);
                setInputs([{ name: "", api: "" }]);
                handleCloseModal();
            }
        } catch (error) {
            console.log(error, 'sjhfjfsjfjfj');

            if (error.response?.data?.message === 'All api endpoints already exists') {
                generateAlert('Api endpoint(s) already exists', 'error');
            }
            else {
                generateAlert('Error adding API Endpoints globally', 'error');
            }
            console.error("Error adding API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateApiEndpoints = async (endpoints) => {
        console.log(endpoints, 'handleUpdateApiEndpoints');

        if (endpoints.length === 0) return;

        setLoading(true);
        try {
            const response = await axios.put(
                `${API_BASE_URL}${Endpoints?.UpdateApiEndpoints}`,
                { apiEndpoints: endpoints }
            );

            if (response.data.success) {
                console.log("API Endpoints Updated Successfully");
                fetchApiEndpoints();  // Refresh data
            }
        } catch (error) {
            console.error("Error updating API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleOpenModal = (apiId) => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    const handleDeleteApiEndpoint = async () => {
        try {
            const id = selectedApiId.current;
            const response = await axios.delete(`${API_BASE_URL}${Endpoints?.DeleteApiEndpoint}${id}`);

            if (response.status === 200 && response.data.success) {
                if (response?.data?.message === 'Api endpoint deleted successfully') {
                    setEndpoints(endpoints.filter((api) => api?._id !== id));
                    selectedApiId.current = '';
                    handleAlertClose();
                }
            }
        } catch (err) {

            console.error("Error deleting enterprise:", err);
        }
    }


    const handleAlertOpen = (apiId) => {
        selectedApiId.current = apiId;
        setDeleteAlert(true);
    };

    const handleAlertClose = () => {
        setDeleteAlert(false);
    };

    const handleAlertDeleteApi = () => {
        handleDeleteApiEndpoint()
    }


    const generateAlert = (message, severity) => {
        const obj = { open: true, message, severity };
        setAlertStatus(obj)
    }

    const handleStatusAlertClose = (event, reason) => {
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
                onClose={handleStatusAlertClose}
                position={alertStatus.position}
            />
            <Box sx={{ maxWidth: '100%', margin: "auto", mt: 4, p: 2, }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={3}>
                        <Typography variant="h6" gutterBottom>
                            API Endpoints
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="outlined" color="primary" onClick={handleOpenModal}>
                            Add API Endpoint
                        </Button>
                    </Grid>
                </Grid>

                {
                    endpoints?.length > 0 && <List>
                        {endpoints.map((endpoint, index) => (
                            <ListItem key={endpoint._id}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={7}>
                                        <Controller
                                            name={`endpoints.${index}.api`}
                                            control={control}
                                            defaultValue={endpoint.api}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="API URL"
                                                    fullWidth
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const updatedValue = e.target.value;
                                                        setValue(`endpoints.${index}.api`, updatedValue);
                                                        setEndpoints(prev => {
                                                            const updated = [...prev];
                                                            updated[index].api = updatedValue;
                                                            return updated;
                                                        });
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        <Controller
                                            name={`endpoints.${index}.method`}
                                            control={control}
                                            defaultValue={endpoint.method}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    fullWidth
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const updatedValue = e.target.value;
                                                        setValue(`endpoints.${index}.method`, updatedValue);
                                                        setEndpoints(prev => {
                                                            const updated = [...prev];
                                                            updated[index].method = updatedValue;
                                                            return updated;
                                                        });
                                                    }}
                                                >
                                                    <MenuItem value="get">GET</MenuItem>
                                                    <MenuItem value="post">POST</MenuItem>
                                                </Select>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleUpdateApiEndpoints([{ ...endpoint, id: endpoint?._id }])}
                                            disabled={loading}
                                        >
                                            {loading ? "Updating..." : "Update"}
                                        </Button>
                                        <IconButton
                                            aria-label="delete"
                                            color="error"
                                            onClick={() => handleAlertOpen(endpoint?._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                }


                <Modal open={modalOpen} onClose={handleCloseModal}>
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 1200, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
                        <IconButton
                            edge="end"
                            aria-label="close"
                            onClick={handleCloseModal}
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
                            Add API Endpoint
                        </Typography>


                        {inputs.map((input, index) => (
                            <>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={7}>
                                        <Controller
                                            name={`inputs.${index}.api`}
                                            control={control}
                                            defaultValue={input.api}
                                            rules={{
                                                required: "Endpoint URL is required",
                                                pattern: {
                                                    value: /^(https?:\/\/)[\w.-]+(\.[a-z]{2,})+.*$/,
                                                    message: "Enter a valid URL",
                                                },
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Endpoint URL"
                                                    fullWidth
                                                    value={input.api}
                                                    onChange={(e) => handleChange(index, "api", e.target.value)}
                                                    error={!!errors?.inputs?.[index]?.api}
                                                    helperText={errors?.inputs?.[index]?.api?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        <Controller
                                            name={`inputs.${index}.method`}
                                            control={control}
                                            defaultValue={input.method}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    fullWidth
                                                    value={input.method}
                                                    onChange={(e) => handleChange(index, "method", e.target.value)}
                                                >
                                                    <MenuItem value="get">GET</MenuItem>
                                                    <MenuItem value="post">POST</MenuItem>
                                                </Select>
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <br /><br />
                            </>
                        ))}

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                                <Button variant="contained" fullWidth color="success" onClick={handleSubmit(handleAddEndpoint)} disabled={loading}>
                                    {loading ? "Saving..." : "Save Endpoints"}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button disabled={inputs.length === maxInputs} fullWidth variant="contained" onClick={handleAddInput}>
                                    Add Input
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </Box>
            <Dialog
                open={deleteAlert}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete this API endpoint?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleAlertClose}>Cancel</Button>
                    <Button onClick={handleAlertDeleteApi} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default AddApiEndpointsComp;
