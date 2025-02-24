import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Clear session data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page
        router.push("/admin/login");
    };

    return (
        <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
                <PowerSettingsNewIcon sx={{ fill: 'white', width: '30px', height: '30px' }} />
                {/* <img src="/assets/icons/logout.png" width={30} height={30} alt="Logout" /> */}
            </IconButton>
        </Tooltip>
    );
};

export default LogoutButton;
