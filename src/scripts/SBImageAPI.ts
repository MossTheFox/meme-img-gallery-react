import { apiUrl } from "../store/globalConst";

export interface SingleImageData {
    _id: string;
    fileName: string | string[];
    rate?: "N/A" | "everyone" | "restricted" | "danger";
    fav?: boolean;
    favTimes?: number;
};

export type SBImageData = SingleImageData;

export interface UserInfoCard {
    uid: string;
    username: string;
    avatar?: string;
    signature?: string;
};

export interface SharedCollectionInfoRes {
    pages: number;
    count: number;
    userInfo: UserInfoCard;
};

function defaultAbortSignal() {
    let controller = new AbortController();
    setTimeout(() => {
        controller.abort();
    }, 5000);
    return controller.signal;
}

type SBImageStatus = {
    lastUpdate: string;
    total: number;
};

export async function getSBImageStatus(signal = defaultAbortSignal()): Promise<SBImageStatus> {
    let res = await fetch(`${apiUrl}/sb/img-v2/status`, {
        method: "GET",
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== 'ok') {
        throw new Error(json?.message || "unknown error");
    }
    return {
        lastUpdate: json?.data?.lastUpdate ?? "未知",
        total: json?.data?.total ?? -1
    };
}

export async function getFirst(harmonyMode: boolean = true, signal = defaultAbortSignal()): Promise<SBImageData[]> {
    let res = await fetch(`${apiUrl}/sb/img-v2/rush/first`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            harmonyMode
        }),
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function getWithStartID(startID: string, harmonyMode: boolean = true, signal = defaultAbortSignal()): Promise<SBImageData[]> {
    let res = await fetch(`${apiUrl}/sb/img-v2/rush/start-at`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            startID,
            harmonyMode
        }),
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function getNextTen(current: string, harmonyMode: boolean = true, signal = defaultAbortSignal()): Promise<SBImageData[]> {
    let res = await fetch(`${apiUrl}/sb/img-v2/rush/next`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            current,
            harmonyMode
        }),
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function getPrevTen(current: string, harmonyMode: boolean = true, signal = defaultAbortSignal()): Promise<SBImageData[]> {
    let res = await fetch(`${apiUrl}/sb/img-v2/rush/prev`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            current,
            harmonyMode
        }),
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function getRandom(harmonyMode: boolean = true, signal = defaultAbortSignal()): Promise<SBImageData[]> {
    let res = await fetch(`${apiUrl}/sb/img-v2/rush/random`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            harmonyMode
        }),
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function addFav(currentID: string, signal = defaultAbortSignal()): Promise<string> {
    let res = await fetch(`${apiUrl}/sb/img-v2/collection`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: currentID
        }),
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return "收藏成功";
}

export async function removeFav(currentID: string, signal = defaultAbortSignal()): Promise<string> {
    let res = await fetch(`${apiUrl}/sb/img-v2/collection`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            id: currentID
        }),
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return "已取消收藏";
}

export async function getMyCollection(page: number, signal = defaultAbortSignal()): Promise<SBImageData[]> {
    let res = await fetch(`${apiUrl}/sb/img-v2/collection?page=${page}`, {
        method: "GET",
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function getMyCollectionNumberOfPages(signal = defaultAbortSignal()): Promise<number> {
    let res = await fetch(`${apiUrl}/sb/img-v2/collection/number-of-pages`, {
        method: "GET",
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return Number(json.data);
}

// 分享相关

/**
 * 查看当前分享状态
 * @returns 通过检查是 null 还是有效字符串来获取分享状态
 */
export async function getMySharingStatus(signal = defaultAbortSignal()): Promise<string | null> {
    let res = await fetch(`${apiUrl}/sb/img-v2/share/config`, {
        method: "GET",
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function stopSharing(signal = defaultAbortSignal()): Promise<string> {
    let res = await fetch(`${apiUrl}/sb/img-v2/share/config`, {
        method: "DELETE",
        signal,
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            action: "delete"
        })
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json?.message || "已停止分享";
}

export async function refreshSharingToken(signal = defaultAbortSignal()): Promise<string> {
    let res = await fetch(`${apiUrl}/sb/img-v2/share/config`, {
        method: "POST",
        signal,
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            action: "create"
        })
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json?.data || "";
}

export async function getSharedCollection(token: string, page: number, harmonyMode = true, signal = defaultAbortSignal()): Promise<SBImageData[]> {
    let res = await fetch(`${apiUrl}/sb/img-v2/share?token=${token}&page=${page}${harmonyMode ? "" : "&harmony=0"}`, {
        method: "GET",
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}

export async function getSharedCollectionInfo(token: string, harmonyMode = true, signal = defaultAbortSignal()): Promise<SharedCollectionInfoRes> {
    let res = await fetch(`${apiUrl}/sb/img-v2/share/info?token=${token}${harmonyMode ? "" : "&harmony=0"}`, {
        method: "GET",
        signal,
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    let json = await res.json();
    if (json?.code !== "ok") {
        throw new Error(json?.message || "unknown error");
    }
    return json.data;
}
