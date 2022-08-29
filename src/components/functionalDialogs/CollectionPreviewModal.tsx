import { Box, Modal, useTheme, useMediaQuery } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SBImageConfigContext } from "../../store/SBImageConfigContext";
import { SB_IMG_URL_PREFIX } from "../../store/SBMainViewerProvider";
import DownloadButtonSingle from "../DownloadButtonSingle";

function CollectionPreviewModal({
    image,
    onClose,
}: {
    image: string | string[] | undefined;
    onClose: () => void;
}) {
    const [open, setOpen] = useState(false);
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const [sbSettings] = useContext(SBImageConfigContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const imgModalStyle: React.CSSProperties = useMemo(() => ({
        maxWidth: "100%",
        minWidth: sbSettings.dontZoomSmallImages ? undefined : (isMobile ? "60vw%" : "300px"),
        marginBottom: "1rem",
        display: "block",
    }), [isMobile, sbSettings]);

    useEffect(() => {
        setOpen(Boolean(image));
    }, [image]);

    return <>
        <Modal open={open} onClose={handleClose}>
            <Box
                onClick={handleClose}
                // p={2}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box display="flex" maxHeight="calc(100vh - 24px)" maxWidth="calc(100vw - 24px)" overflow="auto">
                    <Box overflow="auto">
                        {image && (
                            Array.isArray(image) ? image.map((img, index) => (
                                <img key={index} src={`${SB_IMG_URL_PREFIX}/${img}`} alt="" style={imgModalStyle} />
                            )) : <img src={`${SB_IMG_URL_PREFIX}/${image}`} alt="" style={imgModalStyle}
                            />)}
                    </Box>
                </Box>
            </Box>
        </Modal>
        {Boolean(image) && <DownloadButtonSingle fileName={image as string | string[]} />}
    </>
}

export default CollectionPreviewModal;