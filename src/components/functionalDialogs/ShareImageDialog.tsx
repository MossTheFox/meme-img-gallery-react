import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert, AlertTitle, Stack, Snackbar } from '@mui/material';
import { useState, useCallback, useContext } from 'react';
// import useAsync from '../../scripts/useAsync';
import { SBMainViewerContext } from '../../store/SBMainViewerContext';

function ShareImageDialog({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: (open: boolean) => void;
}) {
    const [viewerState] = useContext(SBMainViewerContext)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarData, setSnackbarData] = useState<{
        severity: "success" | "info" | "warning" | "error" | undefined;
        title?: string;
        message: string;
    }>({
        severity: undefined,
        title: "",
        message: ""
    });

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    /*
    const cpShareLink = useCallback(async () => {
        return await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?go=${viewerState.currentID}`);
    }, [viewerState.currentID]);

    const cpOnSuccess = useCallback(() => {
        setSnackbarData({
            severity: "success",
            message: "复制成功",
        });
        setSnackbarOpen(true);
    }, []);

    const cpOnError = useCallback((err: Error) => {
        setSnackbarData({
            severity: "error",
            title: "复制失败",
            message: "可以尝试手动复制一下。"
        });
        setSnackbarOpen(true);
    }, []);

    const fireCopy = useAsync(cpShareLink, cpOnSuccess, cpOnError);

    */

    const copyShareLink = useCallback(() => {
        if (viewerState.currentID) {
            // fireCopy();
            // 由于 Safari 要求触发复制的用户交互 click 事件必须在调用 clipboard.writeText 的堆栈中，所以这里不能使用 useAsync
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?go=${viewerState.currentID}`)
            .then(() => {
                setSnackbarData({
                    severity: "success",
                    message: "复制成功",
                });
                setSnackbarOpen(true);
            })
            .catch((err: Error) => {
                setSnackbarData({
                    severity: "error",
                    title: "复制失败",
                    message: "可以尝试手动复制一下。"
                });
                setSnackbarOpen(true);
            });
        }
    }, [viewerState.currentID]);

    return <>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>分享当前图片</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>直达当前图片位置的分享链接:</DialogContentText>
                <DialogContentText gutterBottom>{`${window.location.origin}${window.location.pathname}?go=${viewerState.currentID}`}</DialogContentText>
                <Stack spacing={1} pb={1}>
                    <Button disabled={!Boolean(viewerState.currentID)} variant="contained" onClick={copyShareLink}>复制链接</Button>
                </Stack>

                <DialogContentText gutterBottom variant="body2">图组的顺序每天会刷新。直达的图片不会变，但前后的图片大概率是已经被打乱了的。</DialogContentText>
                <DialogContentText gutterBottom variant="body2">如果遇到喜欢的图，记得及时收藏或者保存到本地。</DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>关闭</Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} autoHideDuration={2000}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <Alert variant="filled" severity={snackbarData.severity}>
                {Boolean(snackbarData.title) && <AlertTitle>{snackbarData.title}</AlertTitle>}
                {snackbarData.message}
            </Alert>
        </Snackbar>


    </>
}

export default ShareImageDialog;