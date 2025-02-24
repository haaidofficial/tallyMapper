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
    Autocomplete,
    Card
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import { useRouter } from "next/router";
import SnackbarAlert from "../Alerts";

const AttachApi = () => {
    const router = useRouter();
    const [endpoints, setEndpoints] = useState([]);
    const [inputs, setInputs] = useState([{ name: "", url: "", headers: [] }]);
    const [inputList, setInputList] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(false);
    const [endpointsAutoComplete, setEndpointsAutoComplete] = useState([]);
    const [attachedEndpoints, setAttachedEndpoints] = useState([]);
    const [alertStatus, setAlertStatus] = useState({ open: false, message: '', severity: 'success', position: { vertical: 'top', horizontal: 'right' } });

    const { enterpriseId, enterpriseName } = router.query;

    const maxInputs = 8;

    const { control, handleSubmit, setValue, formState: { errors } } = useForm();

    console.log(router, 'router');
    useEffect(() => {
        if (enterpriseId) {
            fetchApiEndpoints();
        }
    }, [enterpriseId]);

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
            if (response.data?.success && response?.data?.message === 'Api Endpoints added successfully') {
                generateAlert('New Api Endpoint Attached successfully', 'success');
                fetchApiEndpoints();
                setEndpoints([...endpoints, ...validInputs]);
                setInputs([{ name: "", url: "", headers: [] }]);
            }
        } catch (error) {
            generateAlert('Failed to Attach Api Endpoint. Please try again.', 'error');
            console.error("Error adding API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };


    const fetchApiEndpoints = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetAllApiEndpoints}/${enterpriseId}`);
            if (response.data.status === 200) {
                const apiEndpoints = response.data?.data?.apiEndpoints;
                const attachedApis = response.data?.data?.attachedApis;

                const attachedEndpointsList = attachedApis?.map(attachedApi => {
                    const found = apiEndpoints?.find(apiConfig => apiConfig?._id === attachedApi);
                    return {
                        attachedApi: found ? found?.api : null
                    }
                });

                setAttachedEndpoints(attachedEndpointsList);
                setEndpointsAutoComplete(apiEndpoints);
            }
        } catch (error) {
            generateAlert('Error fetching API endpoints', 'error');
            console.error("Error fetching API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteInput = (index) => {
        setInputs(prevState => {
            if (prevState.length < 2) { return prevState; }
            const modifiedInputs = JSON.parse(JSON.stringify(prevState));
            modifiedInputs?.splice(index, 1);
            return modifiedInputs;
        });
    }


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
            <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, }}>
                <Box sx={{ width: 1200, }}>
                    {
                        enterpriseName && <Typography variant="h4" fontWeight={600} gutterBottom textAlign="left" color="#616161">
                            Enterprise Name: {enterpriseName}
                        </Typography>
                    }

                    <Typography variant="h6" gutterBottom>
                        Add API Endpoint
                    </Typography>


                    {inputs.map((input, index) => (
                        <>
                            <Card key={index} sx={{ mb: 3, p: 3, boxShadow: 1, borderRadius: 3, backgroundColor: "#f9f9f9" }}>
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
                                                    sx={{ mr: 2, backgroundColor: "#fff", borderRadius: 1 }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={7.5}>
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
                                                    options={endpointsAutoComplete.map((api) => api?.api)}

                                                    renderOption={(props, option) => {
                                                        const isAttached = attachedEndpoints?.find(api => api?.attachedApi === option);
                                                        return (
                                                            <li
                                                                {...props}
                                                                style={{
                                                                    color: isAttached ? "black" : "blue",
                                                                    opacity: isAttached ? 0.7 : 1,
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                }}
                                                            >
                                                                {isAttached ? <>{option} {''}<small><b>(Attached)</b></small></> : option}
                                                            </li>
                                                        );
                                                    }}

                                                    value={input.url}
                                                    onChange={(_, option) => {
                                                        handleChange(index, "url", option || '')
                                                    }}

                                                    getOptionDisabled={(option) => {
                                                        const isAttached = attachedEndpoints?.find(api => api?.attachedApi === option);

                                                        console.log(attachedEndpoints, option, isAttached, 'aHFJFJjfjfJ');
                                                        return isAttached ? true : false
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Endpoint URL"
                                                            fullWidth
                                                            error={!!errors?.inputs?.[index]?.url}
                                                            helperText={errors?.inputs?.[index]?.url?.message}
                                                            sx={{ mr: 2, backgroundColor: "#fff", borderRadius: 1 }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={0.5}>
                                        {
                                            inputs?.length > 1 && <IconButton color="error" onClick={() => handleDeleteInput(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
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
                            </Card>
                            <br /><br />
                        </>
                    ))}

                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
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
            </Box>
        </>
    );
};

export default AttachApi;