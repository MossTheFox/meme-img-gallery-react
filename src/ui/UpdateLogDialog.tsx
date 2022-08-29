import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useCallback } from "react";
import { updateLog } from "../store/globalConst";

function UpdateLogDialog({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: (open: boolean) => void
}) {
    const close = useCallback(() => setOpen(false), [setOpen]);
    return <Dialog open={open} onClose={close}
        fullWidth
        maxWidth="sm"
    >
        <DialogTitle>SB Image - 更新日志</DialogTitle>
        <DialogContent>
            <Typography variant="body2" color="textSecondary" whiteSpace={"pre-line"}>
                {updateLog}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={close}>关闭</Button>
        </DialogActions>
    </Dialog>
}

export default UpdateLogDialog;