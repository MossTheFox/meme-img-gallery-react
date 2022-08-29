import { Menu, MenuItem, Avatar, Snackbar, Alert, Fab } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import UserContext from "../store/UserContext";
import { logout } from "../scripts/AccountAPI";
import useAsync from "../scripts/useAsync";
import { avatarPlaceholder, avatarUrlPrefix } from "../store/globalConst";
import ExternalLink from "../ui/icons/ExternalLink";
import { SBMainViewerContext } from "../store/SBMainViewerContext";
import { SBImageConfigContext } from "../store/SBImageConfigContext";

function UserNavAvatar() {
    // 站点设置
    const [sbConfig] = useContext(SBImageConfigContext);

    // 用户全局信息
    const [userState, dispatch] = useContext(UserContext);
    // 一级菜单
    const [anchorElement, setAchorElement] = useState(null);
    // 二级菜单
    const [secondAnchorElement, setSecondAnchorElement] = useState(null);
    // 载入过程中锁定
    const [loading, setLoading] = useState(false);
    // Snackbar 提示文字
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // 一级菜单点击事件
    const handleClick = useCallback((event) => {
        setAchorElement(event.currentTarget);
    }, []);
    const handleClose = useCallback(() => {
        setAchorElement(null);
    }, []);
    // 二级菜单点击事件
    const handleSecondClick = useCallback((event) => {
        setSecondAnchorElement(event.currentTarget);
    }, []);
    // 两个菜单同时关闭
    const handleSecondClose = useCallback(() => {
        setSecondAnchorElement(null);
        setAchorElement(null);
    }, []);
    // 仅关闭二级菜单
    const handleSecondClose_ex = useCallback(() => {
        if (!loading) {
            setSecondAnchorElement(null);
        }
    }, [loading]);

    // 注销操作的几个异步操作
    const asyncLogout = useCallback(async (signal) => {
        return await logout(signal);
    }, []);
    const logoutOnSuccess = useCallback((msg) => {
        setLoading(false);
        handleSecondClose();    // 这句和下句的两个顺序不能颠倒，怀疑是这边触发的内存泄漏
        dispatch({              // 如果之后没遇到的话，就当是解决了
            type: "LOGOUT"
        });
    }, [dispatch, handleSecondClose]);
    const logoutOnError = useCallback((err) => {
        setLoading(false);
        setSnackbarMessage("登出失败，请检查网络环境。错误信息：" + String(err));
    }, []);
    const fireLogout = useAsync(asyncLogout, logoutOnSuccess, logoutOnError);
    const logoutAction = useCallback(() => {
        setLoading(true);
        fireLogout();
    }, [fireLogout]);

    const snackBarCallback = useCallback(() => {
        setSnackbarMessage("");
    }, []);


    // ========== 额外 ==========

    const [, , , regFunc] = useContext(SBMainViewerContext);

    const openCollection = useCallback(() => {
        handleClose();
        regFunc?.openCollection && regFunc.openCollection();
    }, [handleClose, regFunc]);


    return <>
        {Boolean(sbConfig.showUserAvatar) && <>
            <Fab size="small" onClick={handleClick} aria-label="用户菜单"
                sx={{
                    p: 0
                }}
            >
                {/* placeholder */}
                <Avatar alt={`${userState.username} avatar`} src={`${avatarUrlPrefix}/${userState.avatar || avatarPlaceholder}`} />
            </Fab>
            <Menu
                anchorEl={anchorElement}
                open={Boolean(anchorElement)}
                onClose={handleClose}
            >
                <MenuItem disabled
                    sx={{
                        opacity: "1 !important",
                        color: (theme) => `${theme.palette.primary.main} !important`,
                    }}
                >{`${userState.username} (uid: ${userState.uid})`}</MenuItem>
                <MenuItem onClick={openCollection}>
                    查看收藏
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    window.location.href = "/me";
                }}
                >账户信息 <ExternalLink /></MenuItem>
                <MenuItem onClick={handleSecondClick}
                >登出</MenuItem>
            </Menu>
            <Menu
                anchorEl={secondAnchorElement}
                open={Boolean(secondAnchorElement)}
                onClose={loading ? () => { } : handleSecondClose}
            >
                <MenuItem disabled
                    sx={{
                        opacity: "1 !important",
                        color: (theme) => `${theme.palette.error.main} !important`,
                    }}
                >确定要登出吗？</MenuItem>
                <MenuItem onClick={logoutAction}
                    disabled={loading}
                >{loading ? "正在登出..." : "登出账号"}</MenuItem>
                <MenuItem onClick={handleSecondClose_ex}
                    disabled={loading}
                >{loading ? "..." : "取消"}</MenuItem>
            </Menu>

            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                open={Boolean(snackbarMessage)}
                onClose={snackBarCallback}
                message={snackbarMessage}
            >
                <Alert severity="warning" variant="filled" >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>}
    </>;
}

export default UserNavAvatar;