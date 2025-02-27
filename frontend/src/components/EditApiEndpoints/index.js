// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//     Box,
//     List,
//     ListItem,
//     ListItemText,
//     IconButton,
//     Typography,
//     Modal,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     CircularProgress,
//     Button,
//     TextField,
//     Backdrop
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloseIcon from "@mui/icons-material/Close";
// import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
// import { useRouter } from "next/router";

// const EditApiEndpoints = () => {
//     const router = useRouter();
//     const [open, setOpen] = useState(false);
//     const [endpoints, setEndpoints] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [expanded, setExpanded] = useState(null);
//     const [enterpriseName, setEnterpriseName] = useState('');

//     const { enterpriseId } = router.query;

//     useEffect(() => {
//         if (enterpriseId) {
//             fetchApiEndpoints();
//         }
//     }, [enterpriseId]);

//     const fetchApiEndpoints = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetEnterpriseApiEndpoints}${enterpriseId}`);
//             if (response.data.status === 200) {
//                 setEndpoints(response.data?.data?.apiEndpoints);
//                 setEnterpriseName(response.data?.data?.enterpriseName);
//             }
//         } catch (error) {
//             console.error("Error fetching API endpoints:", error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteEndpoint = async (index, endpoint) => {
//         setLoading(true);
//         try {
//             const response = await axios.post(`${API_BASE_URL}${Endpoints?.DeleteEnterpriseApiEndpoint}${enterpriseId}`, {
//                 apiId: endpoint?.apiId
//             });
//             debugger
//             if (response.status === 200) {
//                 if (response?.data?.message === 'Api endpoint deleted successfully') {
//                     const updatedEndpoints = endpoints.filter((_, i) => i !== index);
//                     setEndpoints(updatedEndpoints);
//                 }
//             }
//         } catch (error) {
//             console.error("Error deleting API endpoint:", error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }

//     };

//     const handleHeadersChange = (value, outerIndex, innerIndex = null, inputType) => {
//         setEndpoints(prevState =>
//             prevState.map((endpoint, i) =>
//                 i === outerIndex
//                     ? {
//                         ...endpoint,
//                         ...(inputType === "apiName"
//                             ? { apiName: value } // Update apiName
//                             : {
//                                 headers: endpoint.headers.map((header, j) =>
//                                     j === innerIndex
//                                         ? { ...header, [inputType]: value } // Update header field
//                                         : header
//                                 )
//                             })
//                     }
//                     : endpoint
//             )
//         );
//     };

//     const updateApiEndpointConfig = async (apiEndpointConfig) => {
//         console.log(apiEndpointConfig, 'apiEndpointConfig');

//         try {
//             setLoading(true);
//             const response = await axios.post(`${API_BASE_URL}${Endpoints?.UpdateEnterpriseApiEndpointConfig}${enterpriseId}`, {
//                 apiName: apiEndpointConfig?.apiName,
//                 apiId: apiEndpointConfig?.apiId,
//                 headers: apiEndpointConfig?.headers
//             });
//             if (response.status === 200) {
//                 if (response.data?.message === 'API Endpoint headers updated successfully') {

//                 }
//             }
//         } catch (error) {
//             console.error("Error updating API endpoint headers:", error.response?.data?.message || error.message);
//             setLoading(false);
//         }
//         finally {
//             setLoading(false);
//         }

//     }

//     const handleTextSelection = (event) => {
//         const range = document.createRange();
//         const selection = window.getSelection();
//         range.selectNodeContents(event.target);
//         selection.removeAllRanges();
//         selection.addRange(range);
//     };

//     console.log(endpoints, 'endpoints');

//     return (
//         <>
//             <Backdrop
//                 sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//                 open={loading}
//             >
//                 <CircularProgress color="inherit" />
//             </Backdrop>
//             <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
//                 <Box sx={{ width: '90%' }}>

//                     <Typography variant="h6" gutterBottom>
//                         Enterprise Name: {enterpriseName}
//                     </Typography>
//                     <Typography variant="h6" gutterBottom>
//                         API Endpoints
//                     </Typography>

//                     {loading ? (
//                         <Typography>Loading Endpoints</Typography>
//                     ) : endpoints.length === 0 ? (
//                         <Typography>No API Endpoints Found</Typography>
//                     ) : (
//                         <List>
//                             {endpoints.map((endpoint, index) => (
//                                 <ListItem key={index} sx={{ display: "block", borderBottom: "1px solid #ddd", p: 2 }}>
//                                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                         <Box sx={{ display: "flex", flexDirection: "column" }}>
//                                             <TextField label="API Name" value={endpoint.apiName} onChange={(e) => handleHeadersChange(e.target.value, index, null, 'apiName')} />
//                                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                                                 <Typography>
//                                                     URL:{' '}
//                                                 </Typography>
//                                                 <ListItemText
//                                                     secondary={<Typography sx={{ wordBreak: "break-all", color: 'blue' }} onClick={handleTextSelection} >{endpoint.url}</Typography>}
//                                                 />
//                                             </Box>
//                                         </Box>
//                                         <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEndpoint(index, endpoint)}>
//                                             <DeleteIcon />
//                                         </IconButton>
//                                     </Box>

//                                     {/* Accordion for headers */}
//                                     <Accordion expanded={expanded === index} onChange={() => setExpanded(expanded === index ? null : index)} sx={{ mt: 1 }}>
//                                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                                             <Typography>Headers</Typography>
//                                         </AccordionSummary>
//                                         <AccordionDetails>
//                                             {Array.isArray(endpoint.headers) ? (
//                                                 endpoint.headers.length > 0 ? (
//                                                     endpoint.headers.map((header, i) => (
//                                                         <Box key={i} sx={{ mb: 1, p: 1, display: 'flex' }}>
//                                                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                                 <Typography sx={{ margin: '0 10px' }}><strong>Key:</strong></Typography>
//                                                                 <TextField value={header.key} onChange={(e) => handleHeadersChange(e.target.value, index, i, 'key')} />
//                                                             </Box>
//                                                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                                 <Typography sx={{ margin: '0 10px' }}><strong>Value:</strong></Typography>
//                                                                 <TextField value={header.value} onChange={(e) => handleHeadersChange(e.target.value, index, i, 'value')} />
//                                                             </Box>
//                                                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                                 <Typography sx={{ margin: '0 10px' }}><strong>Type:</strong></Typography>
//                                                                 <TextField value={header.type} onChange={(e) => handleHeadersChange(e.target.value, index, i, 'type')} />
//                                                             </Box>
//                                                         </Box>
//                                                     ))
//                                                 ) : (
//                                                     <Typography>No headers found</Typography>
//                                                 )
//                                             ) : endpoint.headers ? (
//                                                 <Box sx={{ p: 1, display: 'flex' }}>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                         <Typography sx={{ margin: '0 10px' }}><strong>Key:</strong></Typography>
//                                                         <TextField value={endpoint.headers.key} />
//                                                     </Box>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                         <Typography sx={{ margin: '0 10px' }}><strong>Value:</strong></Typography>
//                                                         <TextField value={endpoint.headers.value} />
//                                                     </Box>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                         <Typography sx={{ margin: '0 10px' }}><strong>Type:</strong></Typography>
//                                                         <TextField value={endpoint.headers.type} />
//                                                     </Box>
//                                                 </Box>
//                                             ) : (
//                                                 <Typography>No headers found</Typography>
//                                             )}
//                                             <Button sx={{ marginLeft: '15px' }} variant="contained" onClick={() => updateApiEndpointConfig(endpoint)}>Update</Button>
//                                         </AccordionDetails>

//                                     </Accordion>
//                                 </ListItem>
//                             ))}
//                         </List>
//                     )}
//                 </Box>
//             </Box>
//         </>
//     );
// };

// export default EditApiEndpoints;




// 1st version
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//     Box,
//     List,
//     ListItem,
//     Card,
//     CardContent,
//     IconButton,
//     Typography,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     CircularProgress,
//     Button,
//     TextField,
//     Backdrop,
//     Divider,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
// import { useRouter } from "next/router";

// const EditApiEndpoints = () => {
//     const router = useRouter();
//     const [endpoints, setEndpoints] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [expanded, setExpanded] = useState(null);
//     const [enterpriseName, setEnterpriseName] = useState('');
//     const { enterpriseId } = router.query;

//     useEffect(() => {
//         if (enterpriseId) fetchApiEndpoints();
//     }, [enterpriseId]);

//     const fetchApiEndpoints = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetEnterpriseApiEndpoints}${enterpriseId}`);
//             if (response.data.status === 200) {
//                 setEndpoints(response.data?.data?.apiEndpoints);
//                 setEnterpriseName(response.data?.data?.enterpriseName);
//             }
//         } catch (error) {
//             console.error("Error fetching API endpoints:", error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteEndpoint = async (index, endpoint) => {
//         setLoading(true);
//         try {
//             const response = await axios.post(`${API_BASE_URL}${Endpoints?.DeleteEnterpriseApiEndpoint}${enterpriseId}`, {
//                 apiId: endpoint?.apiId
//             });
//             if (response.status === 200 && response?.data?.message === 'Api endpoint deleted successfully') {
//                 setEndpoints(prev => prev.filter((_, i) => i !== index));
//             }
//         } catch (error) {
//             console.error("Error deleting API endpoint:", error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 3 }}>
//             <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
//                 <CircularProgress color="inherit" />
//             </Backdrop>
//             <Box sx={{ width: '100%', maxWidth: 800 }}>
//                 <Typography variant="h4" fontWeight={600} gutterBottom textAlign="center">
//                     {enterpriseName ? `Enterprise: ${enterpriseName}` : "API Endpoints"}
//                 </Typography>

//                 {loading ? (
//                     <Typography textAlign="center">Loading Endpoints...</Typography>
//                 ) : endpoints.length === 0 ? (
//                     <Typography textAlign="center">No API Endpoints Found</Typography>
//                 ) : (
//                     <List>
//                         {endpoints.map((endpoint, index) => (
//                             <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
//                                 <CardContent>
//                                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                         <TextField
//                                             fullWidth
//                                             label="API Name"
//                                             value={endpoint.apiName}
//                                             onChange={(e) => {
//                                                 setEndpoints(prev => prev.map((ep, i) => i === index ? { ...ep, apiName: e.target.value } : ep));
//                                             }}
//                                             sx={{ mr: 2 }}
//                                         />
//                                         <IconButton color="error" onClick={() => handleDeleteEndpoint(index, endpoint)}>
//                                             <DeleteIcon />
//                                         </IconButton>
//                                     </Box>
//                                     <Divider sx={{ my: 2 }} />
//                                     <Typography variant="body2" color="textSecondary" sx={{ wordBreak: "break-all" }}>
//                                         <strong>URL:</strong> {endpoint.url}
//                                     </Typography>
//                                     <Accordion expanded={expanded === index} onChange={() => setExpanded(expanded === index ? null : index)} sx={{ mt: 2 }}>
//                                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                                             <Typography variant="subtitle1">Headers</Typography>
//                                         </AccordionSummary>
//                                         <AccordionDetails>
//                                             {endpoint.headers?.length > 0 ? (
//                                                 endpoint.headers.map((header, i) => (
//                                                     <Box key={i} sx={{ mb: 2, display: "flex", gap: 2 }}>
//                                                         <TextField fullWidth label="Key" value={header.key} />
//                                                         <TextField fullWidth label="Value" value={header.value} />
//                                                         <TextField fullWidth label="Type" value={header.type} />
//                                                     </Box>
//                                                 ))
//                                             ) : (
//                                                 <Typography>No headers found</Typography>
//                                             )}
//                                         </AccordionDetails>
//                                     </Accordion>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </List>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default EditApiEndpoints;









// second version

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    List,
    ListItem,
    Card,
    CardContent,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Button,
    TextField,
    Backdrop,
    Divider,
    Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import { useRouter } from "next/router";
import SnackbarAlert from "../Alerts";

const EditApiEndpoints = () => {
    const router = useRouter();
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [enterpriseName, setEnterpriseName] = useState('');
    const [alertStatus, setAlertStatus] = useState({ open: false, message: '', severity: 'success', position: { vertical: 'top', horizontal: 'right' } });
    const { enterpriseId } = router.query;

    useEffect(() => {
        if (enterpriseId) fetchApiEndpoints();
    }, [enterpriseId]);

    const fetchApiEndpoints = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetEnterpriseApiEndpoints}${enterpriseId}`);
            if (response.data.status === 200) {
                setEndpoints(response.data?.data?.apiEndpoints);
                setEnterpriseName(response.data?.data?.enterpriseName);
            }
        } catch (error) {
            generateAlert('Error fetching API endpoints', 'error');
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
            if (response.status === 200 && response?.data?.message === 'Api endpoint deleted successfully') {
                setEndpoints(prev => prev.filter((_, i) => i !== index));
            }
        } catch (error) {
            console.error("Error deleting API endpoint:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteApiHeader = (outerIndex, innerIndex) => {
        setEndpoints(prevState => {
            const newEndpoints = [...prevState];
            newEndpoints[outerIndex].headers.splice(innerIndex, 1)
            return newEndpoints;
        })
    }

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
                    generateAlert('Api Configuration updated successfully', 'success');
                }
            }
        } catch (error) {
            generateAlert('Failed to update Api Configuration. Please try again.', 'error');
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
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', }}>
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Box sx={{ width: '100%', maxWidth: 1200, p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" fontWeight={600} gutterBottom textAlign="left" color="#616161">
                        {enterpriseName ? `Enterprise: ${enterpriseName}` : "API Endpoints"}
                    </Typography>

                    {
                        endpoints.length === 0 && <Typography textAlign="center">No API Endpoints Found</Typography>
                    }

                    {
                        endpoints.length > 0 && <List>
                            {endpoints.map((endpoint, index) => (
                                <Card key={index} sx={{ mb: 3, p: 3, boxShadow: 1, borderRadius: 3, backgroundColor: "#f9f9f9" }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="API Name"
                                                value={endpoint.apiName}
                                                // onChange={(e) => {
                                                //     setEndpoints(prev => prev.map((ep, i) => i === index ? { ...ep, apiName: e.target.value } : ep));
                                                // }}
                                                onChange={(e) => handleHeadersChange(e.target.value, index, null, 'apiName')}
                                                sx={{ mr: 2, backgroundColor: "#fff", borderRadius: 1 }}
                                            />
                                            <IconButton color="error" onClick={() => handleDeleteEndpoint(index, endpoint)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="body1" color="textSecondary" sx={{ wordBreak: "break-all", backgroundColor: "#e3f2fd", p: 1, borderRadius: 1 }}>
                                            <strong>URL:</strong> {endpoint.url}
                                        </Typography>
                                        <Accordion expanded={expanded === index} onChange={() => setExpanded(expanded === index ? null : index)} sx={{ mt: 2, borderRadius: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1">Headers</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {endpoint.headers?.length > 0 ? (
                                                    endpoint.headers.map((header, i) => (
                                                        <Box key={i} sx={{ mb: 2, display: "flex", gap: 2 }}>
                                                            <TextField
                                                                fullWidth
                                                                label="Key"
                                                                value={header.key}
                                                                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                                                onChange={(e) => handleHeadersChange(e.target.value, index, i, 'key')}
                                                            />
                                                            <TextField
                                                                fullWidth
                                                                label="Value"
                                                                value={header.value}
                                                                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                                                onChange={(e) => handleHeadersChange(e.target.value, index, i, 'value')}
                                                            />
                                                            <TextField
                                                                fullWidth
                                                                label="Type"
                                                                value={header.type}
                                                                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                                                onChange={(e) => handleHeadersChange(e.target.value, index, i, 'type')}
                                                            />
                                                            <IconButton color="error" onClick={() => handleDeleteApiHeader(index, i)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Typography>No headers found</Typography>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    </CardContent>
                                    <Button sx={{ marginLeft: '15px', marginBottom: '10px' }} variant="contained" onClick={() => updateApiEndpointConfig(endpoint)}>Save</Button>
                                </Card>
                            ))}
                        </List>
                    }
                </Box>
            </Box>
        </>
    );
};

export default EditApiEndpoints;






// third version


