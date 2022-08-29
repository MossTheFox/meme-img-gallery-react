import { Share } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { SBMainViewerContext } from "../store/SBMainViewerContext";
import { SBImageConfigContext } from "../store/SBImageConfigContext";
import ShareImageDialog from "./functionalDialogs/ShareImageDialog";

function ShareButton() {
    const [sbSiteSettings] = useContext(SBImageConfigContext);
    const [viewerState] = useContext(SBMainViewerContext);
    const [open, setOpen] = useState(false);
    const openDialog = useCallback(() => {
        setOpen(true);
    }, []);

    return <>{Boolean(sbSiteSettings.showShareButton) && <>
        <Box position="relative" sx={{
            position: "fixed",
            bottom: "calc(16px + 56px + 16px - 1px)",    // 56px: MuiSpeedDial 的高度
            right: "calc(1rem + 1px)",
            zIndex: 2,  // 高于 Swiper 低于 Backdrop
        }}>
            <IconButton
                disabled={!Boolean(viewerState.currentID)}
                onClick={openDialog}
                sx={{
                    filter: "drop-shadow(2px 2px 0px rgba(119, 119, 119, 0.6))",
                }}
                size="large"
                color="primary"
            >
                <Share fontSize="large" />
            </IconButton>
        </Box>

        <ShareImageDialog open={open} setOpen={setOpen} />
    </>}
    </>
}

export default ShareButton;