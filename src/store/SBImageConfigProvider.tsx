import { useCallback, useState } from "react";
import { getSBImageStatus } from "../scripts/SBImageAPI";
import useAsync from "../scripts/useAsync";
import { currentSBImageConfig, defaultSBImageConfig, SBImageConfigContext, SBImageConfigContextInterface } from "./SBImageConfigContext";

function SBImageConfigProvider({ children }: { children: React.ReactNode }) {

    const [config, setConfig] = useState<SBImageConfigContextInterface>(currentSBImageConfig);

    const set = useCallback((key: keyof SBImageConfigContextInterface, value: SBImageConfigContextInterface[keyof SBImageConfigContextInterface]) => {
        setConfig((config) => {
            let newConfig = {
                ...config,
                [key]: value
            };
            localStorage.setItem("SBImageConfig", JSON.stringify(newConfig));
            return newConfig;
        });
    }, []);

    // 初始化 SBImage 服务状态
    const getSBImageStatusOnSuccess = useCallback((data: Awaited<ReturnType<typeof getSBImageStatus>>) => {
        set("lastUpdate", data.lastUpdate);
        set("total", data.total);
    }, [set]);

    const getSBImageStatusOnError = useCallback((e: Error) => {
        set("lastUpdate", "获取出错，刷新后将重试");
        set("total", -1);
    }, [set]);

    useAsync(getSBImageStatus, getSBImageStatusOnSuccess, getSBImageStatusOnError, true);

    const get = useCallback((key: keyof SBImageConfigContextInterface) => config[key], [config]);

    const reset = useCallback(() => {
        setConfig(defaultSBImageConfig);
        localStorage.removeItem("SBImageConfig");
    }, []);

    return <SBImageConfigContext.Provider value={[config, set, get, reset]}>
        {children}
    </SBImageConfigContext.Provider>
}

export default SBImageConfigProvider;