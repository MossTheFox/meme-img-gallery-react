import { useCallback, useContext, useEffect, useState } from "react";
import { SBMainViewerContext } from "../store/SBMainViewerContext";
import SharedCollectionDialog from "./functionalDialogs/SharedCollectionDialog";

function SharingLinkHandler() {
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState("");
    const [directGo, setDirectGo] = useState("");
    const [, , , regFunc] = useContext(SBMainViewerContext);

    useEffect(() => {
        let parser = new URLSearchParams(window.location.search);
        let tk = parser.get("share");
        let directGo = parser.get("go");
        if (tk) {
            setToken(tk);
            setOpen(true);
            return;
        }
        if (directGo) {
            setDirectGo(directGo);
            window.history.replaceState({}, "", window.location.pathname);
            return;
        }
    }, []);

    useEffect(() => {
        if (directGo) {
            if (regFunc.reset) {
                regFunc.reset(false, false, directGo);
            }
            setDirectGo("");
            return;
        }
    }, [regFunc, directGo]);

    const [, , , , registerFunc] = useContext(SBMainViewerContext);

    const parseAndOpen = useCallback((tk: string) => {
        setToken(tk);
        setOpen(true);
    }, []);

    useEffect(() => {
        registerFunc(parseAndOpen, "parseShareToken");
    }, [registerFunc, parseAndOpen]);

    return <>
        <SharedCollectionDialog
            open={open}
            setOpen={setOpen}
            token={token}
        />
    </>
}

export default SharingLinkHandler;