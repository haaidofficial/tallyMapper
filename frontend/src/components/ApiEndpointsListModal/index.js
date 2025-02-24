import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Modal,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Button,
    TextField,
    Backdrop
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";

const ApiEndpointsListModal = ({ selectedEnterprise }) => {
    const [open, setOpen] = useState(false);
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(null);

    const enterpriseId = selectedEnterprise?.id;

    useEffect(() => {
        if (open && enterpriseId) {
            fetchApiEndpoints();
        }
    }, [open, enterpriseId]);

    const fetchApiEndpoints = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetEnterpriseApiEndpoints}${enterpriseId}`);
            if (response.data.status === 200) {
                setEndpoints(response.data.data.apiEndpoints);
            }
        } catch (error) {
            console.error("Error fetching API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEndpoint = async (index, endpoint) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}${Endpoints?.DeleteEnterpriseApiEndpoint}${enterpriseId}`, {
                apiId: endpoint?.apiId
            });
            debugger
            if (response.status === 200) {
                if (response?.data?.message === 'Api endpoint deleted successfully') {
                    const updatedEndpoints = endpoints.filter((_, i) => i !== index);
                    setEndpoints(updatedEndpoints);
                }
            }
        } catch (error) {
            console.error("Error deleting API endpoint:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }

    };


    const handleHeadersChange = (value, outerIndex, innerIndex = null, inputType) => {
        setEndpoints(prevState =>
            prevState.map((endpoint, i) =>
                i === outerIndex
                    ? {
                        ...endpoint,
                        ...(inputType === "apiName"
                            ? { apiName: value } // Update apiName
                            : {
                                headers: endpoint.headers.map((header, j) =>
                                    j === innerIndex
                                        ? { ...header, [inputType]: value } // Update header field
                                        : header
                                )
                            })
                    }
                    : endpoint
            )
        );
    };



    const updateApiEndpointConfig = async (apiEndpointConfig) => {
        console.log(apiEndpointConfig, 'apiEndpointConfig');

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}${Endpoints?.UpdateEnterpriseApiEndpointConfig}${enterpriseId}`, {
                apiName: apiEndpointConfig?.apiName,
                apiId: apiEndpointConfig?.apiId,
                headers: apiEndpointConfig?.headers
            });
            if (response.status === 200) {
                if (response.data?.message === 'API Endpoint headers updated successfully') {

                }
            }
        } catch (error) {
            console.error("Error updating API endpoint headers:", error.response?.data?.message || error.message);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }

    }



    const handleTextSelection = (event) => {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(event.target);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    console.log(endpoints, 'endpoints');

    return (
        <>

            {/* Button to open the modal */}
            <Button variant="contained" onClick={() => setOpen(true)}>
                Edit API
            </Button>

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>

                <>
                    <Backdrop
                        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 1000, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2, minHeight: '600px', maxHeight: '600px', overflowY: 'scroll' }}>

                        <IconButton
                            edge="end"
                            aria-label="close"
                            onClick={() => setOpen(false)}
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
                            API Endpoints
                        </Typography>

                        {loading ? (
                            <Typography>Loading Endpoints</Typography>
                        ) : endpoints.length === 0 ? (
                            <Typography>No API Endpoints Found</Typography>
                        ) : (
                            <List>
                                {endpoints.map((endpoint, index) => (
                                    <ListItem key={index} sx={{ display: "block", borderBottom: "1px solid #ddd", p: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                <TextField label="API Name" value={endpoint.apiName} onChange={(e) => handleHeadersChange(e.target.value, index, null, 'apiName')} />
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Typography>
                                                        URL:{' '}
                                                    </Typography>
                                                    <ListItemText
                                                        secondary={<Typography sx={{ wordBreak: "break-all", color: 'blue' }} onClick={handleTextSelection} >{endpoint.url}</Typography>}
                                                    />
                                                </Box>
                                            </Box>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEndpoint(index, endpoint)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>

                                        {/* Accordion for headers */}
                                        <Accordion expanded={expanded === index} onChange={() => setExpanded(expanded === index ? null : index)} sx={{ mt: 1 }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Headers</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {Array.isArray(endpoint.headers) ? (
                                                    endpoint.headers.length > 0 ? (
                                                        endpoint.headers.map((header, i) => (
                                                            <Box key={i} sx={{ mb: 1, p: 1, display: 'flex' }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography sx={{ margin: '0 10px' }}><strong>Key:</strong></Typography>
                                                                    <TextField value={header.key} onChange={(e) => handleHeadersChange(e.target.value, index, i, 'key')} />
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography sx={{ margin: '0 10px' }}><strong>Value:</strong></Typography>
                                                                    <TextField value={header.value} onChange={(e) => handleHeadersChange(e.target.value, index, i, 'value')} />
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography sx={{ margin: '0 10px' }}><strong>Type:</strong></Typography>
                                                                    <TextField value={header.type} onChange={(e) => handleHeadersChange(e.target.value, index, i, 'type')} />
                                                                </Box>
                                                            </Box>
                                                        ))
                                                    ) : (
                                                        <Typography>No headers found</Typography>
                                                    )
                                                ) : endpoint.headers ? (
                                                    <Box sx={{ p: 1, display: 'flex' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography sx={{ margin: '0 10px' }}><strong>Key:</strong></Typography>
                                                            <TextField value={endpoint.headers.key} />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography sx={{ margin: '0 10px' }}><strong>Value:</strong></Typography>
                                                            <TextField value={endpoint.headers.value} />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography sx={{ margin: '0 10px' }}><strong>Type:</strong></Typography>
                                                            <TextField value={endpoint.headers.type} />
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Typography>No headers found</Typography>
                                                )}
                                                <Button sx={{ marginLeft: '15px' }} variant="contained" onClick={() => updateApiEndpointConfig(endpoint)}>Update</Button>
                                            </AccordionDetails>

                                        </Accordion>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </>
            </Modal>
        </>
    );
};

export default ApiEndpointsListModal;
