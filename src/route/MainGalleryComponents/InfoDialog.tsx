import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback } from "react";

function InfoDialog({
    alertData,
    initAction
}: {
    alertData: {
        severity: "info" | "warning" | "error" | "success";
        title: string;
        content: string;
        action?: () => void;
    } | null;
    initAction: () => void;
}) {

    const initFunc = useCallback(() => {
        initAction();
    }, [initAction]);


    return <Dialog fullWidth maxWidth="sm" open={!!alertData}>
        <DialogTitle>信息</DialogTitle>
        <DialogContent>
            <Alert severity={alertData?.severity || "success"} variant="filled"
                action={alertData?.severity === "error" &&
                    <Button color="inherit" onClick={initFunc}>重试</Button>
                }
            >
                <AlertTitle>{alertData?.title || "ok"}</AlertTitle>
                {alertData?.content || "已完成"}
            </Alert>
        </DialogContent>
        <DialogActions>
            <Button disabled>关闭</Button>
        </DialogActions>
    </Dialog>
}

export default InfoDialog;