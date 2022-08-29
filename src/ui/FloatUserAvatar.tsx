import { AccountCircle } from "@mui/icons-material";
import { Box, Fab, Menu, MenuItem } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import UserNavAvatar from "../components/UserNavAvatar";
import UserContext from "../store/UserContext";
import ExternalLink from "./icons/ExternalLink";

function FloatUserAvatar() {
    const [userState] = useContext(UserContext);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return <Box sx={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 2
    }}>
        {userState.isLoggedIn ?
            <UserNavAvatar /> :
            <Fab size="small" onClick={handleOpen}><AccountCircle /></Fab>
        }
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
            <MenuItem onClick={() => {
                window.location.href = "/login";
                handleClose();
            }}>登录 / 注册 <ExternalLink /></MenuItem>
        </Menu>
    </Box>;
}

export default FloatUserAvatar;