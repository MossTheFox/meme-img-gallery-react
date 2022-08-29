import { FileDownload } from "@mui/icons-material";
import { Alert, AlertTitle, Box, IconButton, Snackbar } from "@mui/material";
import { useCallback, useContext, useMemo, useState } from "react";
import useAsync from "../scripts/useAsync";
import { SBMainViewerContext } from "../store/SBMainViewerContext";
import { SB_IMG_URL_PREFIX } from "../store/SBMainViewerProvider";
import { SBImageConfigContext } from "../store/SBImageConfigContext";

function DownloadButton() {
    const [viewerState,] = useContext(SBMainViewerContext);
    const [sbSiteConfig] = useContext(SBImageConfigContext);

    const [loading, setLoading] = useState(false);
    const [snackbarAlert, setSnackbarAlert] = useState<{
        severity: "success" | "error" | "info" | "warning" | undefined;
        title: string;
        message: string;
    }>({
        severity: undefined,
        title: "",
        message: "",
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const closeSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const downloadLink = useMemo<string | string[]>(() => {
        if (Array.isArray(viewerState.currentFileName)) {
            return viewerState.currentFileName.map(fileName => `${SB_IMG_URL_PREFIX}/download/${fileName}`);
        } else {
            return `${SB_IMG_URL_PREFIX}/${viewerState.currentFileName}`;
        }
    }, [viewerState.currentFileName]);

    const asyncFireGetBlob = useCallback<(sig?: any) => Promise<Blob | Blob[]>>(async (signal) => {
        if (Array.isArray(downloadLink)) {
            return await Promise.all(downloadLink.map(link => fetch(link, { signal }).then(res => res.blob())));
        } else {
            return await fetch(downloadLink, { signal }).then(res => res.blob());
        }
    }, [downloadLink]);

    const getBlobOnSuccess = useCallback((blob: Blob | Blob[]) => {
        if (Array.isArray(blob)) {
            (blob as Blob[]).forEach((b, i) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(b);
                a.download = (viewerState.currentFileName as string[])[i];
                a.click();
            });
        } else {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = viewerState.currentFileName as string;
            a.click();
        }
        // setSnackbarAlert({
        //     severity: "success",     考虑到用户的环境，不显示下载成功的提示
        //     title: "",
        //     message: "下载成功",
        // });
        // setSnackbarOpen(true);
        setLoading(false);
    }, [viewerState.currentFileName]);

    const getBlobOnError = useCallback((err: Error) => {
        setSnackbarAlert({
            severity: "error",
            title: "下载失败",
            message: `错误信息：${err.message} (可以尝试手动保存图片)`,
        });
        setSnackbarOpen(true);
        setLoading(false);
    }, []);

    const fireDownload = useAsync(asyncFireGetBlob, getBlobOnSuccess, getBlobOnError);

    const downloadAction = useCallback(() => {
        setLoading(true);
        if (downloadLink) {
            fireDownload();
        }
    }, [fireDownload, downloadLink]);

    return <>{sbSiteConfig.showDownloadButton && <>
        <Box position="relative" sx={{
            position: "fixed",
            bottom: "calc(16px - 1px)",    // 56px: MuiSpeedDial 的高度
            left: "calc(16px - 1px)",
            zIndex: 2,  // 高于 Swiper 低于 Backdrop
        }}>
            <IconButton
                sx={{
                    filter: "drop-shadow(2px 2px 0px rgba(119, 119, 119, 0.6))",
                }}
                size="medium"
                onClick={downloadAction}
                disabled={loading}
            >
                <FileDownload />
            </IconButton>
        </Box>
        <Snackbar open={snackbarOpen} anchorOrigin={{
            horizontal: "center",
            vertical: "bottom"
        }}
            onClose={closeSnackbar}
            autoHideDuration={2000}
        >
            <Alert variant="filled" severity={snackbarAlert.severity}>
                {Boolean(snackbarAlert.title) && <AlertTitle>{snackbarAlert.title}</AlertTitle>}
                {snackbarAlert.message}
            </Alert>
        </Snackbar>
    </>}
    </>
}

export default DownloadButton;