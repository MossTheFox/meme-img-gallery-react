import { Share } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert, AlertTitle, Stack, Box, Snackbar, Link, Menu, MenuItem, Typography } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { getMySharingStatus, refreshSharingToken, stopSharing } from '../../scripts/SBImageAPI';
import useAsync from '../../scripts/useAsync';
import DialogLoadingIndicator from '../../ui/smallComponents/DialogLoadingIndicator';

function SharingStatusDialog({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: (open: boolean) => void;
}) {
    const [currentSharingToken, setCurrentSharingToken] = useState<string | null>(null);
    const [err, setErr] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarData, setSnackbarData] = useState<{
        severity: "success" | "info" | "warning" | "error" | undefined,
        title?: string,
        message: string
    }>({
        severity: undefined,
        title: "",
        message: ""
    });

    const handleClose = useCallback(() => {
        if (!loading) {
            setOpen(false);
        }
    }, [loading, setOpen]);

    const asyncFireInit = useCallback(async (signal) => {
        return await getMySharingStatus(signal);
    }, []);

    const initOnSuccess = useCallback((data: string | null) => {
        setCurrentSharingToken(data);
        setLoading(false);
    }, []);

    const initOnError = useCallback((err: Error) => {
        setErr(err);
        setLoading(false);
    }, []);

    const fireInit = useAsync(asyncFireInit, initOnSuccess, initOnError);

    const initAction = useCallback(() => {
        setLoading(true);
        setErr(null);
        setCurrentSharingToken(null);
        fireInit();
    }, [fireInit]);


    useEffect(() => {
        if (open) {
            initAction();
        }
    }, [open, initAction]);

    /*
    const cpShareLink = useCallback(async () => {
        return await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?share=${currentSharingToken}`);
    }, [currentSharingToken]);

    const cpOnSuccess = useCallback(() => {
        // todo
        setSnackbarData({
            severity: "success",
            message: "复制成功",
        });
        setSnackbarOpen(true);
    }, []);

    const cpOnError = useCallback((err: Error) => {
        // todo
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
        if (currentSharingToken) {
            // fireCopy();
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?share=${currentSharingToken}`)
            .then(() => {
                setSnackbarData({
                    severity: "success",
                    message: "复制成功",
                });
                setSnackbarOpen(true);
            })
            .catch(() => {
                setSnackbarData({
                    severity: "error",
                    title: "复制失败",
                    message: "可以尝试手动复制一下。"
                });
                setSnackbarOpen(true);
            });
        }
    }, [currentSharingToken]);

    const asyncCreateSharingLink = useCallback(async (signal) => {
        return await refreshSharingToken(signal);
    }, []);

    const createSharingLinkOnSuccess = useCallback((data: string) => {
        setCurrentSharingToken(data);
        setLoading(false);
        setSnackbarData({
            severity: "success",
            message: "分享链接创建成功"
        });
        setSnackbarOpen(true);
    }, []);

    const createSharingLinkOnError = useCallback((err: Error) => {
        // setErr(err);
        setLoading(false);
        setSnackbarData({
            severity: "error",
            title: "创建分享链接时发生错误",
            message: "错误信息: " + err?.message
        });
        setSnackbarOpen(true);
    }, []);

    const fireCreateSharingLink = useAsync(asyncCreateSharingLink, createSharingLinkOnSuccess, createSharingLinkOnError);

    const asyncDeleteSharingLink = useCallback(async (signal) => {
        return await stopSharing(signal);
    }, []);

    const [confrmDeleteLinkMenuAnchor, setConfirmDeleteLinkMenuAnchor] = useState<HTMLElement | null>(null);

    const deleteSharingLinkOnSuccess = useCallback((msg: string) => {
        setCurrentSharingToken(null);
        setLoading(false);
        setSnackbarData({
            severity: "info",
            message: "已停用分享功能"
        });
        setSnackbarOpen(true);
    }, []);

    const deleteSharingLinkOnError = useCallback((err: Error) => {
        setSnackbarData({
            severity: "error",
            title: "取消分享时出错",
            message: "错误信息: " + err?.message
        });
        setSnackbarOpen(true);
        setLoading(false);
    }, []);

    const fireDeleteSharingLink = useAsync(asyncDeleteSharingLink, deleteSharingLinkOnSuccess, deleteSharingLinkOnError);

    const removeSharingLinkAction = useCallback(() => {
        setConfirmDeleteLinkMenuAnchor(null);
        setLoading(true);
        setErr(null);
        fireDeleteSharingLink();
    }, [fireDeleteSharingLink]);

    const createSharingLinkAction = useCallback(() => {
        setLoading(true);
        setErr(null);
        fireCreateSharingLink();
    }, [fireCreateSharingLink]);


    return <>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogLoadingIndicator loading={loading} />
            <DialogTitle>分享设置</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>可以将自己的收藏创建一个分享链接。</DialogContentText>
                {loading ? <>
                    <DialogContentText gutterBottom>正在确认信息...</DialogContentText>
                </> : <>
                    {err ? <>
                        <Alert variant="filled" severity="error" action={<Button color="inherit" onClick={initAction}>重试</Button>}>
                            <AlertTitle>获取信息时出错</AlertTitle>
                            错误信息: {`${err?.message}`}
                        </Alert>
                    </> : <>
                        {Boolean(currentSharingToken) ? <>
                            <DialogContentText gutterBottom>当前分享链接:</DialogContentText>
                            <DialogContentText gutterBottom>{`${window.location.origin}${window.location.pathname}?share=${currentSharingToken}`}</DialogContentText>
                            <Stack spacing={1} pb={1}>
                                <Button disabled={loading} variant="contained" onClick={copyShareLink}>复制链接</Button>
                                <Box>
                                    <Link disabled={loading} component="button" onClick={(e) => setConfirmDeleteLinkMenuAnchor(e.currentTarget)} underline="hover">取消分享</Link>
                                </Box>
                            </Stack>

                            <DialogContentText gutterBottom variant="body2">取消分享后，重新创建的分享链接会发生变化。旧链接将立即失效。</DialogContentText>

                            <Menu anchorEl={confrmDeleteLinkMenuAnchor} open={Boolean(confrmDeleteLinkMenuAnchor)}
                                onClose={() => setConfirmDeleteLinkMenuAnchor(null)}
                            >
                                <MenuItem onClick={removeSharingLinkAction}>
                                    <Typography color="error">
                                        确定取消分享
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={() => setConfirmDeleteLinkMenuAnchor(null)}>
                                    取消
                                </MenuItem>
                            </Menu>

                        </> : <>
                            <Button disabled={loading} startIcon={<Share />} variant="contained" onClick={createSharingLinkAction}>创建分享链接</Button>
                        </>}
                    </>}
                </>}
                {/* 测试 */}
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

export default SharingStatusDialog;