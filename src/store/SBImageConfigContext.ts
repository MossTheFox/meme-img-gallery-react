import { createContext } from "react";

export interface SBImageConfigContextInterface {
    clickToTurn: boolean;
    dontZoomSmallImages: boolean;
    applyDevicePixelRatio: boolean;
    turnWithKeyboard: boolean;
    autoplay: boolean;
    autoplayDuration: number;
    safeMode: boolean;
    showDebugInfo: boolean;
    showFavButton: boolean;
    showDownloadButton: boolean;
    showShareButton: boolean;
    showUserAvatar: boolean;
    // 下面两个是全局状态
    lastUpdate: string;
    total: number;
};

export const defaultSBImageConfig: SBImageConfigContextInterface = {
    clickToTurn: false,
    dontZoomSmallImages: false,
    applyDevicePixelRatio: true,
    turnWithKeyboard: true,
    autoplay: false,
    autoplayDuration: 3000,
    safeMode: true,
    showDebugInfo: false,
    showFavButton: true,
    showDownloadButton: true,
    showShareButton: true,
    showUserAvatar: true,

    lastUpdate: "未知",
    total: -1
};

export const SBImageConfigContext = createContext<[
    SBImageConfigContextInterface,
    (key: keyof SBImageConfigContextInterface, value: any) => void,
    (key: keyof SBImageConfigContextInterface) => any,
    () => void
]>([
    defaultSBImageConfig,
    (key, value) => { },
    (key) => { },
    () => { }
]);

// 从 localStorage 中读取一下当前设置
const currentSBImageConfig: SBImageConfigContextInterface = {
    ...defaultSBImageConfig
};

const localStorageKey = "SBImageConfig";
const localStorageConfig = localStorage.getItem(localStorageKey);
try {
    if (localStorageConfig) {
        const config = JSON.parse(localStorageConfig);
        if (config) {
            "clickToTurn" in config && typeof config.clickToTurn === "boolean" && (currentSBImageConfig.clickToTurn = config.clickToTurn);
            "dontZoomSmallImages" in config && typeof config.dontZoomSmallImages === "boolean" && (currentSBImageConfig.dontZoomSmallImages = config.dontZoomSmallImages);
            "applyDevicePixelRatio" in config && typeof config.applyDevicePixelRatio === "boolean" && (currentSBImageConfig.applyDevicePixelRatio = config.applyDevicePixelRatio);
            "turnWithKeyboard" in config && typeof config.turnWithKeyboard === "boolean" && (currentSBImageConfig.turnWithKeyboard = config.turnWithKeyboard);
            "autoplay" in config && typeof config.autoplay === "boolean" && (currentSBImageConfig.autoplay = config.autoplay);
            "autoplayDuration" in config && typeof config.autoplayDuration === "number" && (currentSBImageConfig.autoplayDuration = config.autoplayDuration);
            "safeMode" in config && typeof config.safeMode === "boolean" && (currentSBImageConfig.safeMode = config.safeMode);
            "showDebugInfo" in config && typeof config.showDebugInfo === "boolean" && (currentSBImageConfig.showDebugInfo = config.showDebugInfo);
            "showFavButton" in config && typeof config.showFavButton === "boolean" && (currentSBImageConfig.showFavButton = config.showFavButton);
            "showDownloadButton" in config && typeof config.showDownloadButton === "boolean" && (currentSBImageConfig.showDownloadButton = config.showDownloadButton);
            "showShareButton" in config && typeof config.showShareButton === "boolean" && (currentSBImageConfig.showShareButton = config.showShareButton);
            "showUserAvatar" in config && typeof config.showUserAvatar === "boolean" && (currentSBImageConfig.showUserAvatar = config.showUserAvatar);
        }
    }
} catch (e) {
    process.env.NODE_ENV === "development" && console.error(e);
    localStorage.removeItem(localStorageKey);
}

export { currentSBImageConfig };