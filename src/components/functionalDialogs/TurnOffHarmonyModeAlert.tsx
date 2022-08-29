import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

function TurnOffHarmonyModeAlert({
    open,
    setOpen,
    cb,
}: {
    open: boolean;
    setOpen: (bool: boolean) => void;
    cb: () => void;
}) {
    const close = useCallback(() => setOpen(false), [setOpen]);

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (open) {
            setChecked(false);
        }
    }, [open]);

    const confirm = useCallback(() => {
        setOpen(false);
        cb();
    }, [setOpen, cb]);
    return <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>需要注意</DialogTitle>
        <DialogContent>
            <DialogContentText fontWeight="bolder" gutterBottom>
                关闭和谐模式，意味着您可能遇到不合适的文字、或是冒犯性内容 (地狱笑话、负能量内容等)。
            </DialogContentText>
            <DialogContentText gutterBottom>
                请三思后继续操作。(您可以随时重新启用此模式)
            </DialogContentText>
            <DialogContentText variant="body2" gutterBottom>
                * 被标记为不和谐的图片不能直接通过本站链接被分析，除非对方也关闭了和谐模式
            </DialogContentText>
            <FormControlLabel 
                control={<Checkbox color="primary" checked={checked} onChange={(e) => setChecked(e.target.checked)} />} 
                label="我已知晓、并自行承担查看不和谐内容所带来的一切后果 (包括但不限于被冒犯、遇见恶毒的语言文字等)" />
        </DialogContent>
        <DialogActions>
            <Button onClick={close}>取消</Button>
            <Button disabled={!checked} color="error" onClick={confirm}>继续操作</Button>
        </DialogActions>
    </Dialog>
}

export default TurnOffHarmonyModeAlert;