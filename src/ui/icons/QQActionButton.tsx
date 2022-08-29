import QQIcon from "./QQIcon";

import { Button } from "@mui/material";

function QQActionButton({
    standAlone = true,
    size = "medium",
    text = "QQ 账户授权",
    onClick = () => { },
    fullWidth = false,
}: {
    standAlone?: boolean;
    size?: "small" | "medium" | "large";
    text?: string;
    onClick?: (any: any) => void;
    fullWidth?: boolean;
}) {
    return <Button {...standAlone ? {
        sx: {
            backgroundColor: (theme) => theme.palette.mode === "dark" ? "#86d9ff" : "#31bcdf",
            "&: hover": {
                backgroundColor: (theme) => theme.palette.mode === "dark" ? "#4da5ee" : "#158cb1"
            }
        }
    } : {
        sx: {
            maxWidth: { xs: "80%", sm: "60%" },
            minWidth: "12rem",
            backgroundColor: (theme) => theme.palette.mode === "dark" ? "#86d9ff" : "#31bcdf",
            "&: hover": {
                backgroundColor: (theme) => theme.palette.mode === "dark" ? "#4da5ee" : "#158cb1"
            }
        }
    }}
        fullWidth={fullWidth}
        variant="contained"
        size={size}
        startIcon={<QQIcon />}
        onClick={onClick}
    >
        {text}
    </Button>
}

export default QQActionButton;