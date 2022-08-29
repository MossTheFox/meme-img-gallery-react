import { Close, Menu as MenuIcon } from "@mui/icons-material";
import { Backdrop, Box, Chip, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { SBImageConfigContext } from "../store/SBImageConfigContext";

function DialMenu({
    actions = []
}: {
    actions?: {
        icon: JSX.Element;
        label: string;
        onClick: () => void;
    }[];
}) {
    const [sbSiteConfig] = useContext(SBImageConfigContext);
    const [open, setOpen] = useState(false);
    const handleOpen = (e?: any, reason?: "toggle" | "focus" | "mouseEnter") => {
        if (reason === "toggle") {
            setOpen(true);
        }
    };
    const handleClose = (e?: any, reason?: "toggle" | "blur" | "mouseLeave" | "escapeKeyDown") => {
        if (reason === "toggle" || reason === "blur" || !reason) {
            setOpen(false);
        }
    };


    return <>
        <SpeedDial
            ariaLabel="操作菜单"
            sx={{
                position: "fixed",
                bottom: "16px",
                right: "16px"
            }}
            icon={<SpeedDialIcon openIcon={<Close />} icon={<MenuIcon />} />}
            onOpen={handleOpen}
            onClose={handleClose}
            open={open}
        >
            {actions.map(({ icon, label, onClick }) => (
                <SpeedDialAction
                    key={label}
                    icon={icon}
                    tooltipTitle={<Typography width={"max-content"}>{label}</Typography>}
                    tooltipOpen
                    onClick={() => {
                        onClick();
                        handleClose();
                    }}
                />
            ))}
        </SpeedDial>
        <Backdrop sx={{
            zIndex: 5
        }} open={open}>
            <Box sx={{
                position: "fixed",
                left: "1rem",
                bottom: "1rem",
            }}>
                <Stack spacing={2}>
                    <Chip color="primary" label={`最后更新于: ${sbSiteConfig.lastUpdate}`} />
                    <Chip color="primary" label={`图库总量: ${sbSiteConfig.total}`} />
                    <Chip color="info" label={`左右滑动${sbSiteConfig.turnWithKeyboard ? "或使用方向键" : ""}进行翻页`} />
                </Stack>
            </Box>
        </Backdrop>
    </>
}

export default DialMenu;