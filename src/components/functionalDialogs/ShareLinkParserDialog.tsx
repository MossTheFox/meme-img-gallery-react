import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Snackbar, Stack } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import useAsync from "../../scripts/useAsync";
import { SBMainViewerContext } from "../../store/SBMainViewerContext";
import DialogLoadingIndicator from "../../ui/smallComponents/DialogLoadingIndicator";

function ShareLinkParserDialog({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarAlert, setSnackbarAlert] = useState<{
        severity: "info" | "success" | "warning" | "error" | undefined;
        title?: string;
        message: string;
    }>({
        severity: "info",
        message: ""
    });

    const handleClose = useCallback(() => {
        if (!loading) {
            setOpen(false);
        }
    }, [loading, setOpen]);

    const [token, setToken] = useState("");

    const asyncGetClipboardText = useCallback(async () => {
        if ('clipboard' in navigator) {
            try {
                return await navigator.clipboard.readText();
            } catch (e) {
                throw new Error("未能获取剪贴板文本: 操作被阻止");
            }
        }
        throw new Error("当前浏览器不支持 Clipboard API");
    }, []);

    const getClipboardTextOnSuccess = useCallback((text: string) => {
        if (text.includes("?share=")) {
            setToken(text.split("?share=")[1]);
        } else {
            setToken(text);
            setLoading(false);
        }
    }, []);

    const getClipboardTextOnError = useCallback((err: Error) => {
        setSnackbarAlert({
            severity: "error",
            message: err?.message + " (可以将链接粘贴到浏览器地址栏直接访问)"
        });
        setSnackbarOpen(true);
        setLoading(false);
    }, []);

    const fireGetClipboardText = useAsync(asyncGetClipboardText, getClipboardTextOnSuccess, getClipboardTextOnError);

    const [, , , regFunc] = useContext(SBMainViewerContext);

    useEffect(() => {
        if (token) {
            if (regFunc.parseShareToken) {
                regFunc.parseShareToken(token);
            }
            setToken("");
        }
    }, [token, regFunc]);


    return <>
        <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
            <DialogLoadingIndicator loading={loading} />
            <DialogTitle>解析分享链接</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>
                    可以通过分享链接 (或者 Token) 来查看分享的内容。
                </DialogContentText>
                <Stack spacing={1} pb={1}>
                    <Button variant="contained" color="primary" onClick={() => fireGetClipboardText()}>
                        从剪贴板获取
                    </Button>
                    <Box display={"none"}>  
                    {/* TODO */}
                        <Link component={"button"} underline="hover">
                            手动输入
                        </Link>
                    </Box>
                </Stack>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>关闭</Button>
            </DialogActions>
        </Dialog>
        <Snackbar anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
        }} open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
            <Alert variant="filled" severity={snackbarAlert.severity}>
                {Boolean(snackbarAlert.title) && <AlertTitle>{snackbarAlert.title}</AlertTitle>}
                {snackbarAlert.message}
            </Alert>
        </Snackbar>
    </>
}

export default ShareLinkParserDialog;