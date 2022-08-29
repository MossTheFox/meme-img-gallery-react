import { FolderSpecial, Refresh, Settings, Shuffle } from "@mui/icons-material";
// import { useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import DownloadButton from "../components/DownloadButton";
import FavButton from "../components/FavButton";
import CollectionDialog from "../components/functionalDialogs/CollectionDialog";
import ShareButton from "../components/ShareButton";
import { SBMainViewerContext } from "../store/SBMainViewerContext";
import DialMenu from "./DialMenu";
import DrawerConfigMenu from "./DrawerConfigMenu";
import FloatUserAvatar from "./FloatUserAvatar";

function NavigationController() {
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [, , , regFunc, regNewFunc] = useContext(SBMainViewerContext);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [collectionOpen, setCollectionOpen] = useState(false);

    const reload = useCallback(() => {
        setDrawerOpen(false);
        if (regFunc?.reset) {
            regFunc.reset(false, true);
        }
    }, [regFunc]);

    const goRandom = useCallback(() => {
        setDrawerOpen(false);
        if (regFunc?.reset) {
            regFunc.reset(true);
        }
    }, [regFunc]);

    const openSettings = useCallback(() => {
        setDrawerOpen(true);
        setCollectionOpen(false);
    }, []);

    const openCollection = useCallback(() => {
        setDrawerOpen(false);
        setCollectionOpen(true);
    }, []);

    useEffect(() => {
        regNewFunc(openCollection, "openCollection");
    }, [regNewFunc, openCollection]);


    return <>
        <FloatUserAvatar />
        <ShareButton />
        <FavButton />
        <DownloadButton />
        <DialMenu actions={[
            {
                icon: <Refresh />,
                label: "从首张图片开始",
                onClick: reload,
            },
            {
                icon: <Shuffle />,
                label: "随机跳转一下",
                onClick: goRandom,
            },
            {
                icon: <FolderSpecial sx={{
                    color: (theme) => theme.palette.mode === "dark" ? "#ffe44b" : "#ffa600",
                }} />,
                label: "🌟收藏与集锦",
                onClick: openCollection,
            },
            {
                icon: <Settings />,
                label: "设置",
                onClick: openSettings
            }
        ]} />
        <DrawerConfigMenu open={drawerOpen} setOpen={setDrawerOpen} />
        <CollectionDialog open={collectionOpen} setOpen={setCollectionOpen} />
    </>
}

export default NavigationController;