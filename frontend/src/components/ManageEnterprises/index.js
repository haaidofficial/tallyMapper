import React, { useState, useEffect, useRef } from "react";
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
    Dialog, DialogTitle, DialogActions
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ManageApiEndpoints from "../ManageApiEndpoints";
import { API_BASE_URL, Endpoints } from "@/constants/apiEndpoints";
import UpdateEnterpriseModal from "../UpdateEnterpriseModal";
import AddCompanyModal from "../AddCompanyModal";
import ApiEndpointsListModal from "../ApiEndpointsListModal";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from './styles.module.css';

function ManageEnterprises() {
    const router = useRouter();
    const [enterprises, setEnterprises] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [deleteAlert, setDeleteAlert] = useState(false);
    const selectedEnterpriseId = useRef('');

    useEffect(() => {
        fetchEnterprises();
    }, []);

    const fetchEnterprises = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}${Endpoints?.GetEnterprises}`);
            if (response?.data?.success) {
                const enterprisesWithId = response.data.data.map((enterprise) => ({
                    ...enterprise,
                    id: enterprise._id, // Ensure id is set for DataGrid
                }));
                setEnterprises(enterprisesWithId);
            }
        } catch (err) {
            setError("Failed to load enterprises. Please try again.");
            console.error("Error fetching enterprises:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (enterprise) => {
        setSelectedEnterprise(enterprise);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleDeleteEnterprise = async () => {
        try {
            const id = selectedEnterpriseId.current;
            const response = await axios.delete(`${API_BASE_URL}${Endpoints?.DeleteEnterprise}${id}`);

            if (response.data.success) {
                if (response?.data?.message === 'Enterprise deleted successfully') {
                    selectedEnterpriseId.current = '';
                    handleAlertClose();
                    setEnterprises(enterprises.filter((ent) => ent?.id !== id));
                }
                else {
                    setError(response.data.message);
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Failed to delete enterprise. Please try again.");
            console.error("Error deleting enterprise:", err);
        }
    };


    const columns = [
        {
            field: "id", headerName: "S.No", flex: 0.4, renderCell: (params) => {
                const rowModels = params.api.getAllRowIds();
                return rowModels.indexOf(params.id) + 1;
            },
            headerClassName: styles.tableHeader,
        },
        { field: "name", headerName: "Enterprise Name", flex: 1, headerClassName: styles.tableHeader, },
        {
            field: "apiEndpoints",
            headerName: "API Endpoints",
            flex: 0.7,
            headerClassName: styles.tableHeader,
            renderCell: (params) => (
                // <ul style={{ margin: 0, paddingLeft: 16 }}>
                //     {params?.value?.length > 0 ? (
                //         params?.value?.map((api, index) => <li key={index}>{api?.name}</li>)
                //     ) : (
                //         <Typography variant="body2" color="textSecondary">
                //             No APIs Added
                //         </Typography>
                //     )}
                // </ul>
                <Button variant="text" onClick={() => router.push(`/edit-api/${params?.row?.id}`)}>
                    Edit API
                </Button>
                // <ApiEndpointsListModal selectedEnterprise={params.row} />
            ),

        },
        {
            field: "transformTallyResponse",
            headerName: "Transform",
            flex: 0.7,
            headerClassName: styles.tableHeader,
            renderCell: (params) => {
                console.log(params, 'dhfdfddjfdjfdjfj');
                const enterpriseId = params?.id;

                return <Link href={`/transformTallyData/${enterpriseId}`}>
                    <Button variant="text">
                        Transform Tally Data
                    </Button>
                </Link>
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            headerClassName: styles.tableHeader,
            renderCell: (params) => (
                <Box>
                    <Button variant="text" color="primary" onClick={() => router.push(`/attach-api/${params?.row?.id}?enterpriseName=${params?.row?.name}`)}>
                        Attach API
                        {console.log(params, 'paramsparams')}
                    </Button>
                    {/* <Button variant="text" color="primary" onClick={() => handleOpenModal(params.row)}>
                        Attach API
                    </Button> */}
                    <IconButton
                        aria-label="delete"
                        color="error"
                        // onClick={() => handleDeleteEnterprise(params.row._id)}
                        onClick={() => handleAlertOpen(params.row._id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <UpdateEnterpriseModal selectedEnterprise={params.row} enterprises={enterprises} setEnterprises={setEnterprises} />
                </Box>
            ),
        },
    ];


    const handleAlertOpen = (id) => {
        selectedEnterpriseId.current = id;
        setDeleteAlert(true);
    };

    const handleAlertClose = () => {
        setDeleteAlert(false);
    };


    return (
        <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                    <Box sx={{ mt: 1, p: 2, }}>
                        <Grid container sx={{ mb: 1.5 }}>
                            <Grid item xs={6}>
                                <Typography variant="h6">Enterprises</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                                    <Link href={'/add-api-endpoints'}>
                                        <Button variant="contained">Add API Endpoints</Button>
                                    </Link>
                                    <AddCompanyModal enterprises={enterprises} setEnterprises={setEnterprises} />
                                </Box>
                            </Grid>
                        </Grid>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {loading ? (
                            <Box display="flex" justifyContent="center" my={2}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <DataGrid
                                rows={enterprises}
                                columns={columns}
                                pageSizeOptions={[5, 10]}
                                disableSelectionOnClick
                            />
                        )}


                        {/* Add API Modal */}
                        <Modal open={modalOpen} onClose={handleCloseModal}>
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
                                    Add API Endpoints for {selectedEnterprise?.name}
                                </Typography>
                                <ManageApiEndpoints open={modalOpen} handleCloseModal={handleCloseModal} selectedEnterprise={selectedEnterprise} />
                            </Box>
                        </Modal>

                    </Box>
                </Grid>
            </Grid>
            <Dialog
                open={deleteAlert}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete this Enterpise?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleAlertClose}>Cancel</Button>
                    <Button
                        onClick={handleDeleteEnterprise}
                        autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ManageEnterprises;
