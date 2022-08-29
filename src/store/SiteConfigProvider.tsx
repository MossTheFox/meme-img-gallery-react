import { ThemeProvider, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { currentConfig, defaultSiteConfig } from "./globalConst";
import SiteConfigContext from "./SiteConfigContext";
import { themeObject } from "../ui/theme";

function SiteConfigProvider({ children }: { children: React.ReactNode }) {

    const darkMode = useMediaQuery("(prefers-color-scheme: dark)");
    // 确保只初始化一次
    // 直接与 localStorage.siteConfig 同步
    // ⚠️ localStorage 中只能存储字符串，所以做好 JSON.stringify 和 JSON.parse
    const [config, setConfig] = useState<SiteConfigContextObject>(currentConfig);
    const set = useCallback((key: SiteConfigKey, value: SiteConfigContextObject[keyof SiteConfigContextObject]) => {
        setConfig((config) => {
            let newConfig = {
                ...config,
                [key]: value
            };
            localStorage.setItem("siteConfig", JSON.stringify(newConfig));
            return newConfig;
        });
    }, []);
    const get = useCallback((key: SiteConfigKey) => config[key], [config]);

    const reset = useCallback(() => {
        setConfig(defaultSiteConfig);
        localStorage.removeItem("siteConfig");
    }, []);

    const clearLocalStorage = useCallback(() => {
        localStorage.clear();
    }, []);

    // 初始化一次
    useEffect(() => {
        let siteConfig = localStorage.getItem("siteConfig");
        if (siteConfig) {
            try {
                let siteConfigObj = JSON.parse(siteConfig);
                if (typeof siteConfig === "object") {
                    Object.keys(defaultSiteConfig).forEach((key) => {
                        if (key in siteConfigObj) {
                            set(key as SiteConfigKey, siteConfigObj[key]);
                        }
                    });
                }
            } catch (error) {
                process.env.NODE_ENV === "development" && console.error(error);
            }
        }
    }, [set]);

    // 自动更新 theme
    useEffect(() => {
        if (config.themeFollowSystem) {
            set("themeMode", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        }
    }, [config.themeFollowSystem, set, darkMode]);

    return <SiteConfigContext.Provider value={[config, set, get, reset, clearLocalStorage]}>
        <ThemeProvider theme={config.themeMode ? themeObject[config.themeMode] : themeObject.dark}>
            {children}
        </ThemeProvider>
    </SiteConfigContext.Provider>;
}

export default SiteConfigProvider;