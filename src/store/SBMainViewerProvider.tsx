import { useCallback, useState } from "react";
import { currentViewerCache, RegFunc, SBMainViewerContext, SBMainViewerContextInterface } from "./SBMainViewerContext";

export const SB_IMG_URL_PREFIX = "https://tcdn.mxowl.com/owl-site/sb";

function SBMainViewerProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SBMainViewerContextInterface>(currentViewerCache);
    const [registeredFunctions, setRegisteredFunctions] = useState<RegFunc>({});

    const set = useCallback((key: keyof SBMainViewerContextInterface, value: SBMainViewerContextInterface[keyof SBMainViewerContextInterface]) => {
        setState((prev) => {
            let newState = {
                ...prev,
                [key]: value
            };
            localStorage.setItem("SBImageViewer", JSON.stringify(newState));
            return newState;
        });
    }, []);

    const get = useCallback((key: keyof SBMainViewerContextInterface) => {
        return state[key];
    }, [state]);

    // const reset = useCallback((doRandom = false, ignoreSavedProgress = false, startAt?: string) => {
    //     setState(defaultViewerContextObject);
    //     if (typeof registeredFunctions?.reset === "function") {
    //         registeredFunctions.reset(doRandom, ignoreSavedProgress, startAt);
    //     }
    // }, [registeredFunctions]);

    // const toggleFav = useCallback((bool: boolean) => {
    //     if (registeredFunctions?.setFav) {
    //         registeredFunctions.setFav(bool);
    //     }
    // }, [registeredFunctions]);

    const registerFunction = useCallback((func: RegFunc[keyof RegFunc], key: keyof RegFunc) => {
        setRegisteredFunctions((prev) => {
            return {
                ...prev,
                [key]: func
            };
        });
    }, []);

    return <SBMainViewerContext.Provider value={[state, set, get, registeredFunctions, registerFunction]}>
        {children}
    </SBMainViewerContext.Provider>
}

export default SBMainViewerProvider;