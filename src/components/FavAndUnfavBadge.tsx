import { Star, StarBorder } from "@mui/icons-material";
import { Alert, AlertTitle, ButtonBase, Snackbar } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { addFav, removeFav } from "../scripts/SBImageAPI";
import useAsync from "../scripts/useAsync";
import UserContext from "../store/UserContext";

function FavAndUnfavBadge({
    imgID,
    isFav = true,
}: {
    imgID: string;
    isFav?: boolean;
}) {
    const [userState] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [fav, setFav] = useState(isFav);

    const [snackbarAlert, setSnackbarAlert] = useState<{
        severity: "success" | "error" | "info" | "warning" | undefined;
        title?: string;
        message: string;
    }>({
        severity: undefined,
        title: "",
        message: "",
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const closeSnackbar = useCallback(() => setSnackbarOpen(false), []);

    const asyncFireFav = useCallback(async (signal) => {
        if (fav) {
            return await removeFav(imgID, signal)       // 有个小问题是在请求未结束时翻页会触发下一张收藏，是 useAsync 的问题
        } else {                                                        // 暂时先不修
            return await addFav(imgID, signal);
        }
    }, [fav, imgID]);

    const favOnSuccess = useCallback((msg: string | undefined) => {
        setFav(msg === "收藏成功");
        setSnackbarAlert({
            severity: msg === "收藏成功" ? "success" : "info",
            message: msg || "操作成功",
            title: "",
        });
        setSnackbarOpen(true);
        setLoading(false);
    }, []);

    const favOnError = useCallback((err: Error) => {
        setLoading(false);
        setSnackbarAlert({
            severity: "error",
            title: "操作出错",
            message: `错误信息: ${err.message?.includes("aborted") ? "操作被取消" : err?.message}`,
        });
    }, []);

    const fireFav = useAsync(asyncFireFav, favOnSuccess, favOnError);

    const favAction = useCallback(() => {
        if (userState.isLoggedIn) {
            setLoading(true);
            setSnackbarOpen(false);
            fireFav();
        } else {
            setSnackbarAlert({
                severity: "info",
                message: "登录以使用收藏功能"
            });
            setSnackbarOpen(true);
        }
    }, [fireFav, userState.isLoggedIn]);

    return <>
        <ButtonBase
            disabled={loading}
            onClick={favAction}
            // disabled={loading || !userState.isLoggedIn}
            sx={{
                position: "absolute",       // parent 的 position: "relative" 时生效
                top: "0.25rem",
                right: "0.25rem",
                // zIndex: 2,  // 高于 Swiper 低于 Backdrop
                borderRadius: "50%",
                filter: "drop-shadow(2px 2px 0px rgba(119, 119, 119, 0.6))",
                color: "#ffe44b",
                p: 0.75
            }}
        >
            {fav ? <Star /> : <StarBorder />}
        </ButtonBase>

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
    </>
}

export default FavAndUnfavBadge;