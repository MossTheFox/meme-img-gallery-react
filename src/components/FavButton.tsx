import { Star, StarBorder } from "@mui/icons-material";
import { Alert, AlertTitle, Box, ButtonBase, Snackbar, Tooltip, Typography } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { addFav, removeFav } from "../scripts/SBImageAPI";
import useAsync from "../scripts/useAsync";
import { SBMainViewerContext } from "../store/SBMainViewerContext";
import UserContext from "../store/UserContext";
import { SBImageConfigContext } from "../store/SBImageConfigContext";

function FavButton() {
    const [userState] = useContext(UserContext);
    const [sbSiteSettings] = useContext(SBImageConfigContext);
    const [viewerState, setViewerState, , regFunc] = useContext(SBMainViewerContext);

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

    const asyncFireFav = useCallback(async (signal) => {
        if (viewerState.currentID) {
            if (viewerState.fav) {
                return await removeFav(viewerState.currentID, signal)       // 有个小问题是在请求未结束时翻页会触发下一张收藏，是 useAsync 的问题
            } else {                                                        // 暂时先不修
                return await addFav(viewerState.currentID, signal);
            }
        }
    }, [viewerState]);

    const favOnSuccess = useCallback((msg: string | undefined) => {
        if (regFunc?.setFav) {
            regFunc.setFav(msg === "收藏成功");
        }
        if (viewerState.favTimes !== undefined) {
            setViewerState("favTimes", viewerState?.favTimes + (msg === "收藏成功" ? 1 : -1));
        }
        setSnackbarAlert({
            severity: msg === "收藏成功" ? "success" : "info",
            message: msg || "操作成功",
            title: "",
        });
        setSnackbarOpen(true);
        setLoading(false);
    }, [regFunc, viewerState, setViewerState]);

    const favOnError = useCallback((err: Error) => {
        setLoading(false);
        setSnackbarAlert({
            severity: "error",
            title: "操作出错",
            message: `错误信息: ${err.message?.includes("aborted") ? "操作被取消" : err.message}`,
        });
        setSnackbarOpen(true);
    }, []);

    const fireFav = useAsync(asyncFireFav, favOnSuccess, favOnError);

    const favAction = useCallback(() => {
        setSnackbarOpen(false);
        setLoading(true);
        fireFav();
    }, [fireFav]);

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const openTooltip = useCallback(() => setTooltipOpen(true), []);
    const closeTooltip = useCallback(() => setTooltipOpen(false), []);

    return <>{Boolean(sbSiteSettings.showFavButton) && <>
        <Tooltip title={userState.isLoggedIn ? '' : "登录以使用收藏功能"}
            placement="top-start"
            open={tooltipOpen}
            onClose={closeTooltip}
            arrow
            leaveTouchDelay={3000}
        >
            <Box position="relative" sx={{
                position: "fixed",  // 每个按钮的安全区是 16px (最小间隔也是 16px)
                bottom: "calc(16px + 56px + 16px + 56px + 16px - 1.5px)",    // 56px: MuiSpeedDial 的高度, 1.5px: 中和阴影带来的视觉偏移
                right: "calc(1rem + 1.5px)",
                zIndex: 2,  // 高于 Swiper 低于 Backdrop
            }}>
                <ButtonBase
                    onClick={(loading || !userState.isLoggedIn) ? openTooltip : favAction}
                    // disabled={loading || !userState.isLoggedIn}
                    sx={{
                        borderRadius: "50%",
                        width: "56px",
                        height: "56px",
                        filter: "drop-shadow(3px 3px 0px rgba(119, 119, 119, 0.6))",
                        color: "#ffe44b"
                    }}
                >
                    {viewerState.fav ? <Star sx={{ fontSize: "52px" }} /> : <StarBorder sx={{ fontSize: "52px" }} />}
                </ButtonBase>
                {(viewerState?.favTimes && viewerState?.favTimes > 0) ?
                    <Typography color="primary" variant="body2" fontWeight="bolder" p={0.25} sx={{
                        position: "absolute",
                        top: "calc(100% - 6px)",
                        width: "100%",
                        filter: "drop-shadow(3px 3px 0px rgba(119, 119, 119, 0.6))",
                        backgroundColor: "rgba(170, 255, 91, 0.603)",
                        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                        fontWeight: "bold",
                        textAlign: "center",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}>
                        {viewerState.favTimes > 1000 ? `${Math.floor(viewerState.favTimes / 1000)}k` : viewerState.favTimes}
                    </Typography>
                    : null
                }
            </Box>
        </Tooltip>

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
    </>}
    </>
}

export default FavButton;