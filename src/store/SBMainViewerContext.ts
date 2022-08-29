import { createContext } from "react";

export interface SBMainViewerContextInterface {
    currentID?: string;
    currentFileName?: string | string[];
    fav?: boolean;
    favTimes?: number;
    lastTime?: number;
}

export const defaultViewerContextObject: SBMainViewerContextInterface = {
    currentID: "",
    currentFileName: "",
    fav: false,
    favTimes: 0,
    lastTime: Date.now()
};

const currentViewerCache: SBMainViewerContextInterface = {
    currentID: "",
    currentFileName: "",
    fav: false,
    favTimes: 0,
    lastTime: Date.now()
};

let localStorageSaved = localStorage.getItem("SBImageViewer");
if (localStorageSaved) {
    try {
        const obj = JSON.parse(localStorageSaved);
        if (typeof obj !== 'object') {
            throw new Error("some shit went wrong with state cache");
        }
        "currentID" in obj && typeof currentViewerCache.currentID === typeof obj.currentID && (currentViewerCache.currentID = obj.currentID);
        "currentFileName" in obj && typeof currentViewerCache.currentFileName === typeof obj.currentFileName && (currentViewerCache.currentFileName = obj.currentFileName);
        "lastTime" in obj && typeof currentViewerCache.lastTime === typeof obj.lastTime && (currentViewerCache.lastTime = obj.lastTime);
    } catch (err) {
        process.env.NODE_ENV === "development" && console.log(err);
        localStorage.removeItem("SBImageViewer");
    }
}
export { currentViewerCache };

export type RegFunc = {
    reset?: (doRandom?: boolean, ignoreSavedProgress?: boolean, startAt?: string) => void;
    setFav?: (bool: boolean) => void;
    openCollection?: () => void;
    parseShareToken?: (token: string) => void;
};

export const SBMainViewerContext = createContext<[
    SBMainViewerContextInterface,
    (key: keyof SBMainViewerContextInterface, value: SBMainViewerContextInterface[keyof SBMainViewerContextInterface]) => void,
    (key: keyof SBMainViewerContextInterface) => SBMainViewerContextInterface[keyof SBMainViewerContextInterface] | void,
    RegFunc,
    (func: RegFunc[keyof RegFunc], key: keyof RegFunc) => void
]>([
    {},
    (key, v) => { },
    (key) => { },
    {},
    (someShit = () => { }) => { }
]);