import { createContext } from "react";
import { defaultSiteConfig } from "./globalConst";

const SiteConfigContext = createContext<[
    SiteConfigContextObject,
    (key: SiteConfigKey, value: any) => void,
    (key: SiteConfigKey) => any,
    () => void,
    () => void,
]>([
    {
        ...defaultSiteConfig
    },
    (key, value) => { },
    (key) => { },
    /** reset to default */
    () => { },
    /** clear localStorage */
    () => { }
]);

export default SiteConfigContext;