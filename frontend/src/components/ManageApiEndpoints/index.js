import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Grid,
    Modal,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Select,
    MenuItem,
    Autocomplete
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";

const ManageApiEndpoints = ({ open, handleCloseModal, selectedEnterprise }) => {
    const [endpoints, setEndpoints] = useState([]);
    const [inputs, setInputs] = useState([{ name: "", url: "", headers: [] }]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(false);
    const [endpointsAutoComplete, setEndpointsAutoComplete] = useState([]);

    const enterpriseId = selectedEnterprise?.id;
    const maxInputs = 8;

    const { control, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchApiEndpoints();
    }, []);

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
            setInputs([...inputs, { name: "", url: "", headers: [] }]);
        }
    };

    const handleAddHeader = (index) => {
        setInputs(prev => {
            const updated = [...prev];
            updated[index].headers.push({ key: "", value: "", type: "text" });
            return updated;
        });
    };

    const handleHeaderChange = (endpointIndex, headerIndex, field, value) => {
        setInputs(prev => {
            const updated = [...prev];
            updated[endpointIndex].headers[headerIndex][field] = value;
            return updated;
        });
    };

    const handleDeleteHeader = (endpointIndex, headerIndex) => {
        setInputs(prev => {
            const updated = [...prev];
            updated[endpointIndex].headers = updated[endpointIndex].headers.filter((_, i) => i !== headerIndex);
            return updated;
        });
    };

    const handleAddEndpoint = async () => {
        const validInputs = inputs.filter(input => input.name && input.url);
        if (validInputs.length === 0) return;

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}${Endpoints?.AddApiEndpoints}${enterpriseId}`,
                { apiEndpoints: validInputs }
            );
            if (response.data.success) {
                setEndpoints([...endpoints, ...validInputs]);
                setInputs([{ name: "", url: "", headers: [] }]);
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error adding API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };


    const fetchApiEndpoints = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetAllApiEndpoints}`);
            if (response.data.status === 200) {
                setEndpointsAutoComplete(response.data?.data?.apiEndpoints);
            }
        } catch (error) {
            console.error("Error fetching API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <List sx={{ mt: 2 }}>
                {endpoints.map((endpoint, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={endpoint.name} secondary={endpoint.url} />
                        <IconButton edge="end" aria-label="delete" onClick={() => setEndpoints(endpoints.filter((_, i) => i !== index))}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            <Modal open={open} onClose={handleCloseModal}>
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
                                <Grid item xs={3.5}>
                                    <Controller
                                        name={`inputs.${index}.name`}
                                        control={control}
                                        defaultValue={input.name}
                                        rules={{ required: "Endpoint name is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Endpoint Name"
                                                fullWidth
                                                value={input.name}
                                                onChange={(e) => handleChange(index, "name", e.target.value)}
                                                error={!!errors?.inputs?.[index]?.name}
                                                helperText={errors?.inputs?.[index]?.name?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={7}>
                                    <Controller
                                        name={`inputs.${index}.url`}
                                        control={control}
                                        defaultValue={input.url}
                                        rules={{
                                            required: "Endpoint URL is required",
                                            pattern: {
                                                value: /^(https?:\/\/)[\w.-]+(\.[a-z]{2,})+.*$/,
                                                message: "Enter a valid URL",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Autocomplete
                                                freeSolo
                                                options={endpointsAutoComplete.map((api) => api.api)}
                                                getOptionLabel={(option) => option}
                                                value={input.url}
                                                onChange={(_, newValue) => handleChange(index, "url", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Endpoint URL"
                                                        fullWidth
                                                        error={!!errors?.inputs?.[index]?.url}
                                                        helperText={errors?.inputs?.[index]?.url?.message}
                                                        onChange={(e) => handleChange(index, "url", e.target.value)}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12}>
                                    <Box>
                                        <Accordion key={index} expanded={expanded === index} onChange={() => setExpanded(expanded === index ? null : index)}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>{input.name} Headers</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {input.headers.map((header, headerIndex) => (
                                                    <Grid container spacing={2} key={headerIndex} sx={{ mb: 1 }}>
                                                        <Grid item xs={4}>
                                                            <TextField
                                                                label="Key"
                                                                fullWidth
                                                                value={header.key}
                                                                onChange={(e) => handleHeaderChange(index, headerIndex, "key", e.target.value)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={5}>
                                                            <TextField
                                                                label="Value"
                                                                fullWidth
                                                                value={header.value}
                                                                onChange={(e) => handleHeaderChange(index, headerIndex, "value", e.target.value)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <TextField
                                                                label="Type"
                                                                fullWidth
                                                                value={header.type}
                                                                onChange={(e) => handleHeaderChange(index, headerIndex, "type", e.target.value)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton onClick={() => handleDeleteHeader(index, headerIndex)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                                <Button startIcon={<AddIcon />} onClick={() => handleAddHeader(index)}>
                                                    Add Header
                                                </Button>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Box>
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
    );
};

export default ManageApiEndpoints;