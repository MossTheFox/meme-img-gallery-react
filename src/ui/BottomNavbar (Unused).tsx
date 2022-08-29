import { PermMedia } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import SBImageIcon from "./icons/SBImageIcon";
import UserAvatarIcon from "./icons/UserAvatarIcon";

function BottomNavbar() {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname === "/") {
            setValue(0);
        } else if (pathname === "/me") {
            setValue(1);
        } else if (pathname === "/collection") {
            setValue(2);
        }       // TODO Prefix (/service/sb-img/) + React Router Hooks
    }, []);


    return <BottomNavigation
        // showLabels
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue);
        }}
    >
        <BottomNavigationAction label="SB IMG" icon={<SBImageIcon />}
            component={ReactRouterLink} to="/main" />
        <BottomNavigationAction label="集锦" icon={<PermMedia />}
            component={ReactRouterLink} to="/collection" />
        <BottomNavigationAction label="用户面板" icon={<UserAvatarIcon />}
            component={ReactRouterLink} to="/me" />
    </BottomNavigation>
}

export default BottomNavbar;