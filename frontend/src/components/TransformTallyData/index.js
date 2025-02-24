import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    CircularProgress,
    Typography,
    TextField,
    Grid2,
    styled,
    Paper,
    IconButton,
    Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Backdrop from '@mui/material/Backdrop';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import SnackbarAlert from "../Alerts";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1.5),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const TransformTallyData = () => {
    const router = useRouter();
    const { enterpriseId } = router.query; // Get enterprise ID from URL
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [apiResponses, setApiResponses] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [error, setError] = useState("");
    const [selectedEndpoint, setSelectedEndpoint] = useState({ api: '', response: '' });
    const [enterpriseName, setEnterpriseName] = useState('');
    const [textCopied, setTextCopied] = useState(false);
    const [alertStatus, setAlertStatus] = useState({ open: false, message: '', severity: 'success', position: { vertical: 'top', horizontal: 'right' } });

    useEffect(() => {
        if (enterpriseId) {
            fetchApiEndpoints();
        }
    }, [enterpriseId]);

    useEffect(() => {
        generateAlert();
    }, [textCopied]);

    const fetchApiEndpoints = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetEnterpriseApiEndpoints}${enterpriseId}`);
            if (response.data.status === 200) {
                setEndpoints(response.data?.data?.apiEndpoints);
                setEnterpriseName(response.data?.data?.enterpriseName);
            }
        } catch (error) {
            console.error("Error fetching API endpoints:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle accordion toggle
    const handleAccordionChange = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    // Handle input changes
    const handleInputChange = (event, endpoint) => {
        setInputValues({
            ...inputValues,
            [endpoint]: event.target.value,
        });
    };

    // Call the API endpoint
    const callApi = async (endpoint) => {
        setLoading(true);
        console.log(endpoint, 'endpoint')
        try {
            // Convert headers array into an object only if headers exist
            const headers = endpoint?.headers?.length
                ? endpoint.headers.reduce((acc, header) => {
                    acc[header.key] = header.value;
                    return acc;
                }, {})
                : undefined; // If headers are not available, set to undefined

            const request = {
                method: endpoint?.method,
                url: endpoint?.url,
                ...(headers && { headers }) // Spread headers only if available
            };
            console.log(request, 'request');

            const response = await axios(request);
            setApiResponses({ url: endpoint?.url, data: response.data });
        } catch (error) {
            console.error("Error calling API:", error);
            setApiResponses({ ...apiResponses, [endpoint?.url]: "Error fetching data" });
        } finally {
            setLoading(false);
        }
    };

    const removeSpecialCharacters = (text) => {
        try {
            // text?.replace(/[\r\n\t\b\f\v\u200B\uFEFF\u00A0\u202A-\u202E]/g, "")
            const normalJson = JSON.stringify(JSON.parse(text));
            return normalJson;
        } catch (error) {

        }
    }


    const copyText = (text) => {
        console.log(text, 'copyResponseText')
        window.navigator.clipboard.writeText(text);
        setTextCopied(true);
        setTimeout(() => {
            setTextCopied(false);
        }, 1000);
    }

    console.log(apiResponses, 'apiResponses');

    const generateAlert = () => {
        let obj = { open: false, message: '', severity: 'success' };
        if (textCopied) {
            obj = { open: true, message: 'URL Copied', severity: 'success' };
        }
        setAlertStatus(obj)
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertStatus({ open: false, message: '', severity: 'success' })
    }

    const handleTextSelection = (event) => {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(event.target);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    return (
        <>
            <Box sx={{ p: 3, maxWidth: '100%', margin: "auto" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" gutterBottom>
                        API Endpoints for {enterpriseName} ({enterpriseId})
                    </Typography>
                </Box>
                <Grid2 container spacing={2}>
                    {/* <Grid2 size={6}> */}
                        {/* <Box> */}
                            {endpoints.length === 0 ? (
                                <Typography>No API Endpoints Found</Typography>
                            ) : (
                                endpoints.map((endpoint, index) => {
                                    const getterUrl = `${API_BASE_URL}${Endpoints?.ReportGetterUrl}${endpoint?.apiId}/${enterpriseId}`
                                    return (
                                        // <Grid2 container spacing={2}>
                                            <Grid2 size={{ xs: 6, md: 6 }}>
                                                <Box sx={{ marginBottom: '15px' }} key={index}>
                                                    <Item>
                                                        <ListItemText primary={endpoint?.apiName} secondary={endpoint.url} />
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <ListItemText sx={{ color: 'blue' }} primary={'Get Report'} secondary={<span style={{ color: 'blue' }} onClick={handleTextSelection}>{getterUrl}</span>} />
                                                            <Tooltip title="Copy Url">
                                                                <IconButton sx={{ marginTop: '20px' }} onClick={() => copyText(getterUrl)}><ContentCopyIcon /></IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Item>
                                                </Box>
                                            </Grid2>
                                        // </Grid2>
                                    )
                                })
                            )}
                        {/* </Box> */}
                    {/* </Grid2> */}
                    {/* <Grid2 size={8}>

                        <Box>
                            <Card variant="outlined" sx={{ minHeight: '600px', maxHeight: '600px', overflowY: 'scroll', boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px;rgba(0, 0, 0, 0.16) 0px 1px 4px;", bgcolor: "#f5f5f5" }}>

                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="subtitle2">API: {apiResponses?.url}</Typography>
                                        <Tooltip title="Copy Response">
                                            <IconButton onClick={() => copyResponseText(JSON.stringify(apiResponses?.data))}><ContentCopyIcon /></IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="subtitle2">Response:</Typography>
                                    <pre>{JSON.stringify(apiResponses?.data, null, 2) || "No response yet"}</pre>

                                </CardContent>
                            </Card>
                        </Box>

                    </Grid2> */}
                </Grid2>
            </Box>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                message={alertStatus.message}
                severity={alertStatus.severity}
                open={alertStatus.open}
                autoHideDuration={1200}
                onClose={handleAlertClose}
                position={alertStatus.position}
            />
        </>
    );
};

export default TransformTallyData;
