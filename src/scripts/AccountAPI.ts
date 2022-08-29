/**
 * @file AccountAPI.js
 * @author MossTheFox
 * @description 与账户相关的 API，默认的 Cookie 发送策略是 "include"
 */
import { apiUrl } from "../store/globalConst";

const credentials = "include";
const defaultController = () => {
    let controller = new AbortController();
    setTimeout(() => {
        controller.abort();
    }, 10000);  // 10s 网络超时时间
    return controller;
}

/**
 * 获取当前已登录的用户信息，未登录则抛出特定错误 (message: "未登录")
 * @param query 'short=1' | 'card=1' | 'full=1'
 * @returns data: { uid, username, avatar }
 */
async function getLoggedInUserInfo(query: 'short=1' | 'card=1' | 'full=1' = "short=1", fetchSignal = defaultController().signal):
    Promise<{ uid: string; username?: string; avatar?: string }> {
    let res = await fetch(`${apiUrl}/account/info?${query}`, {
        credentials,
        signal: fetchSignal
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        // 特殊：未登录时返回的错误
        throw new Error("Unauthenticated");
    }
    return json?.data;
}

/**
 * 空的 POST 请求即可完成，不校验是否是有效会话
 */
async function logout(fetchSignal = defaultController().signal): Promise<string> {
    let res = await fetch(`${apiUrl}/account/logout`, {
        method: "POST",
        credentials,
        signal: fetchSignal
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "未知错误");
    }
    return json?.message || "注销成功";
}


export {
    getLoggedInUserInfo,
    logout
}