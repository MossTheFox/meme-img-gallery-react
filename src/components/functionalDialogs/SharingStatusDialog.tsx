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
            message: "????????????",
        });
        setSnackbarOpen(true);
    }, []);

    const cpOnError = useCallback((err: Error) => {
        // todo
        setSnackbarData({
            severity: "error",
            title: "????????????",
            message: "?????????????????????????????????"
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
                    message: "????????????",
                });
                setSnackbarOpen(true);
            })
            .catch(() => {
                setSnackbarData({
                    severity: "error",
                    title: "????????????",
                    message: "?????????????????????????????????"
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
            message: "????????????????????????"
        });
        setSnackbarOpen(true);
    }, []);

    const createSharingLinkOnError = useCallback((err: Error) => {
        // setErr(err);
        setLoading(false);
        setSnackbarData({
            severity: "error",
            title: "?????????????????????????????????",
            message: "????????????: " + err?.message
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
            message: "?????????????????????"
        });
        setSnackbarOpen(true);
    }, []);

    const deleteSharingLinkOnError = useCallback((err: Error) => {
        setSnackbarData({
            severity: "error",
            title: "?????????????????????",
            message: "????????????: " + err?.message
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
            <DialogTitle>????????????</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>???????????????????????????????????????????????????</DialogContentText>
                {loading ? <>
                    <DialogContentText gutterBottom>??????????????????...</DialogContentText>
                </> : <>
                    {err ? <>
                        <Alert variant="filled" severity="error" action={<Button color="inherit" onClick={initAction}>??????</Button>}>
                            <AlertTitle>?????????????????????</AlertTitle>
                            ????????????: {`${err?.message}`}
                        </Alert>
                    </> : <>
                        {Boolean(currentSharingToken) ? <>
                            <DialogContentText gutterBottom>??????????????????:</DialogContentText>
                            <DialogContentText gutterBottom>{`${window.location.origin}${window.location.pathname}?share=${currentSharingToken}`}</DialogContentText>
                            <Stack spacing={1} pb={1}>
                                <Button disabled={loading} variant="contained" onClick={copyShareLink}>????????????</Button>
                                <Box>
                                    <Link disabled={loading} component="button" onClick={(e) => setConfirmDeleteLinkMenuAnchor(e.currentTarget)} underline="hover">????????????</Link>
                                </Box>
                            </Stack>

                            <DialogContentText gutterBottom variant="body2">??????????????????????????????????????????????????????????????????????????????????????????</DialogContentText>

                            <Menu anchorEl={confrmDeleteLinkMenuAnchor} open={Boolean(confrmDeleteLinkMenuAnchor)}
                                onClose={() => setConfirmDeleteLinkMenuAnchor(null)}
                            >
                                <MenuItem onClick={removeSharingLinkAction}>
                                    <Typography color="error">
                                        ??????????????????
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={() => setConfirmDeleteLinkMenuAnchor(null)}>
                                    ??????
                                </MenuItem>
                            </Menu>

                        </> : <>
                            <Button disabled={loading} startIcon={<Share />} variant="contained" onClick={createSharingLinkAction}>??????????????????</Button>
                        </>}
                    </>}
                </>}
                {/* ?????? */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>??????</Button>
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