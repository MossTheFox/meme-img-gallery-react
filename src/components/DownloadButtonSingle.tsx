import { FileDownload } from "@mui/icons-material";
import { Alert, AlertTitle, Box, Fab, Snackbar } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import useAsync from "../scripts/useAsync";
import { SB_IMG_URL_PREFIX } from "../store/SBMainViewerProvider";

function DownloadButtonSingle({
    fileName
}: {
    fileName: string | string[];
}) {
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
        if (Array.isArray(fileName)) {
            return fileName.map(fileName => `${SB_IMG_URL_PREFIX}/download/${fileName}`);
        } else {
            return `${SB_IMG_URL_PREFIX}/${fileName}`;
        }
    }, [fileName]);

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
                a.download = (fileName as string[])[i];
                a.click();
            });
        } else {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = fileName as string;
            a.click();
        }
        // setSnackbarAlert({
        //     severity: "success",
        //     title: "",
        //     message: "下载成功",
        // });
        // setSnackbarOpen(true);
        setLoading(false);
    }, [fileName]);

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

    return <>
        <Box position="relative" sx={{
            position: "fixed",
            bottom: "16px",    // 56px: MuiSpeedDial 的高度
            left: "16px",
            zIndex: 1301,  // 1300: MuiModal
        }}>
            <Fab
                size="medium"
                color="primary"
                onClick={downloadAction}
                disabled={loading}
            >
                <FileDownload />
            </Fab>
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
    </>
}

export default DownloadButtonSingle;