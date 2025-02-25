import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

const BackButton = () => {
    const router = useRouter();

    if (router.pathname === "/manage-enterprises" || router.pathname === "/") {
        return null;
    }

    return (
        <Tooltip title="Back">
            <IconButton sx={{ position: 'absolute', top: '20px', right: '20px' }} onClick={() => router.push('/manage-enterprises')}>
                <Image src="/assets/icons/back-button.png" width={35} height={35} />
            </IconButton>
        </Tooltip>
    )
}

export default BackButton;