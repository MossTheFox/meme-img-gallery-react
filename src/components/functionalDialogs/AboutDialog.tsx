import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useCallback } from "react";
import { sbImageVersion } from "../../store/globalConst";

function AboutDialog({
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
        <DialogTitle>关于</DialogTitle>
        <DialogContent sx={{
            "& > p": {
                mb: 2
            }
        }}>
            <DialogContentText gutterBottom>
                {sbImageVersion}
            </DialogContentText>
            <DialogContentText gutterBottom>
                这是一个随机抽取沙雕图的小地方，为传递快乐而生。
            </DialogContentText>
            <DialogContentText fontWeight="bolder" gutterBottom>
                图库源于各路的日常收集，均来自互联网。任何图片传达出的任何情绪、观点、态度，不会代表本站的立场。
            </DialogContentText>
            <DialogContentText gutterBottom>
                图片有进行过人工筛选。保持和谐模式启用 (默认) 可以避免绝大多数的可能具有潜在冒犯性或不利于传播正能量的内容。
            </DialogContentText>
            <DialogContentText gutterBottom>
                图组会在每天凌晨 5:00 进行打乱。遇到喜欢的图一定记得保存。
            </DialogContentText>

        </DialogContent>
        <DialogActions>
            <Button onClick={close}>关闭</Button>
        </DialogActions>
    </Dialog>
}

export default AboutDialog;