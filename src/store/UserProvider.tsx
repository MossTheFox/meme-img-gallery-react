import { Alert, Button, Snackbar, Backdrop, AlertTitle } from "@mui/material";
import { useCallback, useContext, useEffect, useReducer, useState } from "react"
import { getLoggedInUserInfo } from "../scripts/AccountAPI";
import useAsync from "../scripts/useAsync";
import CachedDataContext from "./CachedDataContext";
import UserContext from "./UserContext"

const defaultState: UserContextObject = {
    error: null,
    pending: false,
    isLoggedIn: false,
    uid: "",
    username: "",
    avatar: "",
    signature: ""
    // 生日、性别、账户绑定的信息不做处理
};


function userReducer(state: UserContextObject, action: UserContextDispatchAction) {
    switch (action.type) {
        case "SET_USER":        // Unused
            return {
                ...defaultState,
                ...action.payload,
                isLoggedIn: true
            };
        case "SET_DATA":        // Unused
            return {
                ...defaultState,
                ...state,
                ...action.payload
            };
        case "LOGOUT":
            // 清除缓存的用户信息
            localStorage.removeItem("user");
            return {
                ...defaultState
            };
        case "PENDING":     // 不要轻易改变这个状态，会导致 Router 的重新渲染
            return {
                ...state,
                pending: true
            };
        case "INIT":
            return {
                ...state,
                ...action.payload,
                pending: false
            };
        case "BEFORE_INIT": {
            return {
                ...state,
                ...action.payload,
                pending: true
            };
        }
        case "ERROR":
            // TODO: 由全局组件显示错误提示
            return {
                ...defaultState,
                pending: false,
                error: action?.payload?.error || "初始化页面失败 (验证服务器响应异常或网络超时)，请刷新页面重试"
            };
        case "CLEAR_ERROR":
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
}

function UserProvider({ children }: { children: React.ReactNode }) {
    const [, cacheDispatch, get] = useContext(CachedDataContext);
    const [state, dispatch] = useReducer(userReducer, {
        ...defaultState,
        pending: true   // 只在页面初始化时设置为 true
    });

    // 额外: warning sanckbar
    const [warningSnackbarOpen, setWarningSnackbarOpen] = useState(false);
    const openWarningSnackbar = useCallback(() => setWarningSnackbarOpen(true), []);
    const closeWarningSnackbar = useCallback(() => setWarningSnackbarOpen(false), []);
    const [warningSnackbarContent, setWarningSnackbarContent] = useState({
        title: "",
        message: ""
    });

    // const [retryTimes, setRetryTimes] = useState(0);

    // 页面加载之初，获取用户状态

    var onSuccess = useCallback((data) => {
        let useObj = {
            isLoggedIn: true,
            uid: data.uid,
            username: data.username,
            avatar: data.avatar || "",
            signature: data.signature || "",
        };
        dispatch({
            type: "INIT",
            payload: useObj
        });
        cacheDispatch({
            type: "SET_USER",
            payload: useObj
        });
    }, [cacheDispatch]);

    var onError = useCallback((err) => {
        if (err?.message === "Unauthenticated") {
            dispatch({
                type: "LOGOUT"
            });
            cacheDispatch({
                type: "LOGOUT"
            });
        } else {
            // setRetryTimes((prev) => prev + 1);
            let cachedUserData = get("user");
            if (cachedUserData) {
                setWarningSnackbarContent({
                    title: "未连接到用户验证服务器",
                    message: `将使用缓存的用户信息。错误信息: ${err?.message}`
                });
                openWarningSnackbar();
                dispatch({
                    type: "INIT",
                    payload: {
                        isLoggedIn: true,
                        uid: cachedUserData.uid,
                        username: cachedUserData.username,
                        avatar: cachedUserData.avatar || "",
                        signature: cachedUserData.signature || "",
                    }
                });
            } else {
                dispatch({
                    type: "ERROR",
                    payload: {
                        error: "用户信息初始化失败 (验证服务器响应异常或网络超时)。\n错误信息：" + String(err)
                    }
                });
            }
        }
    }, [cacheDispatch, get, openWarningSnackbar]);
    var asyncFunc = useCallback(async (signal) => {
        return await getLoggedInUserInfo("card=1", signal);
    }, []);

    var fireInit = useAsync(asyncFunc, onSuccess, onError);

    // 自动执行一次
    useEffect(() => {
        // 设置成缓存的值
        let cachedUserData = get("user");
        if (cachedUserData) {
            dispatch({
                type: "BEFORE_INIT",
                payload: {
                    ...cachedUserData,
                    isLoggedIn: true
                }
            });
        }
        fireInit();
    }, [fireInit, get]);

    /**
     * refresh() 刷新用户信息，参数为 true 则会重置页面
     */
    let refresh = useCallback((setPending = false) => {
        if (setPending) {
            dispatch({
                type: "PENDING"
            });
        }
        fireInit();
    }, [fireInit]);

    let snackBarAction = useCallback(() => {
        dispatch({
            type: "CLEAR_ERROR"
        });
        refresh(true);
    }, [refresh]);

    // 负责触发初始化、以及出错尝试重试 (后者未测试)
    // 只在页面初始化时触发一次，如果要重新初始化，刷新页面
    // useEffect(() => {
    //     if (state.pending) {
    //         // console.log("fire or retry", retryTimes);
    //         // if (retryTimes >= 3) {
    //         dispatch({
    //             type: "ERROR"
    //         });
    //         return;
    //         // } else {
    //         //     fireInit();
    //         // }
    //     }
    // }, [/* retryTimes, */state, fireInit]);

    // 额外
    const [backdropOpen, setBackdropOpen] = useState(false);
    const setBackDrop = useCallback((open) => {
        setBackdropOpen(open);
    }, []);

    return (
        <UserContext.Provider value={[state, dispatch, refresh, setBackDrop]}>
            {children}
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                open={Boolean(state.error)}
            // message={state.error}
            // 这个 snackbar 不会消失，且无法手动关闭
            >
                <Alert severity="error" variant="filled"
                    action={
                        <Button onClick={snackBarAction} color="inherit">重试</Button>
                    }
                >{state.error}</Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}
                autoHideDuration={6000}
                open={warningSnackbarOpen}
                onClose={closeWarningSnackbar}
            >
                <Alert severity="warning" variant="filled">
                    <AlertTitle>{warningSnackbarContent.title}</AlertTitle>
                    {warningSnackbarContent.message}
                </Alert>
            </Snackbar>

            {/* 强制黑屏用 ↓ */}
            <Backdrop open={backdropOpen}
                aria-label="say-goodbye"
                invisible={true}
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 1) !important",
                    zIndex: "5000 !important"
                }}
                transitionDuration={1200}
            />
        </UserContext.Provider>
    )
}

export { defaultState };
export default UserProvider;