import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SnackbarAlert = ({ message, severity = "info", open, onClose, position, autoHideDuration }) => {

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
        >
            <MuiAlert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default SnackbarAlert;
