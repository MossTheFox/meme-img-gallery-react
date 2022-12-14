import { DarkMode, ExpandLess, ExpandMore, LightMode } from "@mui/icons-material";
import { Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Switch } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import AboutDialog from "../components/functionalDialogs/AboutDialog";
import TurnOffHarmonyModeAlert from "../components/functionalDialogs/TurnOffHarmonyModeAlert";
import { sbImageVersion } from "../store/globalConst";
import { SBImageConfigContext } from "../store/SBImageConfigContext";
import SiteConfigContext from "../store/SiteConfigContext";
// import UserContext from "../store/UserContext";
import UpdateLogDialog from "./UpdateLogDialog";

function DrawerConfigMenu({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    // const [userState] = useContext(UserContext);
    const [siteConfig, set, get] = useContext(SiteConfigContext);
    const [sbImageConfig, setSB, getSB, resetSB] = useContext(SBImageConfigContext);

    const handleOpen = useCallback(() => setOpen(true), [setOpen]);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);

    const toggleTheme = useCallback(() => {
        set("themeMode", get("themeMode") === "light" ? "dark" : "light");
    }, [get, set]);

    const toggleThemeFollowSystem = useCallback(() => {
        set("themeFollowSystem", !get("themeFollowSystem"));
    }, [get, set]);

    const toggleBackdropFilter = useCallback(() => {
        set("disableBackdropFilter", !get("disableBackdropFilter"));
    }, [get, set]);

    ////////

    // const toggleClickToTurn = useCallback(() => {
    //     setSB("clickToTurn", !getSB("clickToTurn"));
    // }, [getSB, setSB]);

    const toggleDontZoomSmallImages = useCallback(() => {
        setSB("dontZoomSmallImages", !getSB("dontZoomSmallImages"));
    }, [getSB, setSB]);

    const toggleApplyDevicePixelRatio = useCallback(() => {
        setSB("applyDevicePixelRatio", !getSB("applyDevicePixelRatio"));
    }, [getSB, setSB]);

    const toggleTurnWithKeyboard = useCallback(() => {
        setSB("turnWithKeyboard", !getSB("turnWithKeyboard"));
    }, [getSB, setSB]);

    const toggleAutoPlay = useCallback(() => {
        setSB("autoplay", !getSB("autoplay"));
    }, [getSB, setSB]);

    // const toggleShowDebugInfo = useCallback(() => {
    //     setSB("showDebugInfo", !getSB("showDebugInfo"));
    // }, [getSB, setSB]);

    const toggleShowFavButton = useCallback(() => {
        setSB("showFavButton", !getSB("showFavButton"));
    }, [getSB, setSB]);

    const toggleShowDownloadButton = useCallback(() => {
        setSB("showDownloadButton", !getSB("showDownloadButton"));
    }, [getSB, setSB]);

    const toggleShowShareButton = useCallback(() => {
        setSB("showShareButton", !getSB("showShareButton"));
    }, [getSB, setSB]);

    const toggleShowUserAvatar = useCallback(() => {
        setSB("showUserAvatar", !getSB("showUserAvatar"));
    }, [getSB, setSB]);

    const [themeCollapse, setThemeCollapse] = useState(true);
    const toggleThemeCollapse = useCallback(() => setThemeCollapse((prev) => !prev), []);
    const [layoutCollapse, setToggleLayoutCollapse] = useState(true);
    const toggleLayoutCollapse = useCallback(() => setToggleLayoutCollapse((prev) => !prev), []);
    const [assistanceCollapse, setAssistanceCollapse] = useState(true);
    const toggleAssistanceCollapse = useCallback(() => setAssistanceCollapse((prev) => !prev), []);
    const [advancedCollapse, setAdvancedCollapse] = useState(false);
    const toggleAdvancedCollapse = useCallback(() => setAdvancedCollapse((prev) => !prev), []);



    const [updateLogDialogOpen, setUpdateLogDialogOpen] = useState(false);
    const openUpdateLogDialog = useCallback(() => setUpdateLogDialogOpen(true), []);

    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
    const openAboutDialog = useCallback(() => setAboutDialogOpen(true), []);

    const [advancedConfigUnlocked, setAdvancedConfigUnlocked] = useState(0);
    const unlockAdvancedConfig = useCallback(() => setAdvancedConfigUnlocked((prev) => prev + 1), []);

    const [turnOffHarmonyDialogOpen, setTurnOffHarmonyDialogOpen] = useState(false);
    const openTurnOffAlert = useCallback(() => setTurnOffHarmonyDialogOpen(true), []);
    const confirmTurnOffHarmonyMode = useCallback(() => {
        setSB("safeMode", false);
    }, [setSB]);

    const toggleSafeMode = useCallback(() => {
        if (!getSB("safeMode")) {
            setSB("safeMode", true);
        } else {
            openTurnOffAlert();
        }
    }, [getSB, setSB, openTurnOffAlert]);


    return <SwipeableDrawer disableSwipeToOpen anchor="right" open={open} onOpen={handleOpen} onClose={handleClose}>
        <List>
            <ListItemButton onClick={toggleThemeCollapse}>
                <ListItemText primary="????????????" />
                {themeCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={themeCollapse} sx={{ pl: 4 }}>
                <ListItemButton disabled={siteConfig.themeFollowSystem} onClick={toggleTheme}>
                    <ListItemIcon>{siteConfig.themeMode === 'dark' ? <DarkMode /> : <LightMode />}</ListItemIcon>
                    <ListItemText primary="????????????" secondary={siteConfig.themeMode === 'dark' ? "??????" : "??????"} />
                </ListItemButton>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="??????????????????????????????????????????" />
                    <Switch checked={siteConfig.themeFollowSystem} onChange={toggleThemeFollowSystem} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="??????????????????????????????????????????????????????????????????" />
                    <Switch checked={siteConfig.disableBackdropFilter} onChange={toggleBackdropFilter} />
                </ListItem>
            </Collapse>
            <Divider />

            <ListItemButton onClick={toggleLayoutCollapse}>
                <ListItemText primary="????????????" />
                {layoutCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={layoutCollapse} sx={{ pl: 4 }}>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="??????????????????????????????" />
                    <Switch checked={sbImageConfig.showFavButton} onChange={toggleShowFavButton} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="?????????????????????????????????" />
                    <Switch checked={sbImageConfig.showDownloadButton} onChange={toggleShowDownloadButton} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="??????????????????????????????" />
                    <Switch checked={sbImageConfig.showShareButton} onChange={toggleShowShareButton} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="?????????????????????????????????" />
                    <Switch checked={sbImageConfig.showUserAvatar} onChange={toggleShowUserAvatar} />
                </ListItem>
            </Collapse>
            <Divider />

            <ListItemButton onClick={toggleAssistanceCollapse}>
                <ListItemText primary="????????????" />
                {assistanceCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={assistanceCollapse} sx={{ pl: 4 }}>
                {/* <ListItem disabled>
                    <ListItemText primary="??????????????????" secondary="?????????????????????????????????" />
                    <Switch disabled checked={sbImageConfig.clickToTurn} onChange={toggleClickToTurn} />
                </ListItem> */}
                <ListItem>
                    <ListItemText primary="???????????????" secondary="????????????????????????????????????????????????????????????????????????" />
                    <Switch checked={sbImageConfig.dontZoomSmallImages} onChange={toggleDontZoomSmallImages} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="???????????????????????????" secondary="??????????????????????????????????????????????????????????????????????????????????????????????????????????????????" />
                    <Switch checked={sbImageConfig.applyDevicePixelRatio} onChange={toggleApplyDevicePixelRatio} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="??????????????????????????????????????????" />
                    <Switch checked={sbImageConfig.turnWithKeyboard} onChange={toggleTurnWithKeyboard} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="??????????????????" secondary="????????????????????????????????????????????????" />
                    <Switch checked={sbImageConfig.autoplay} onChange={toggleAutoPlay} />
                </ListItem>
                <ListItemButton onClick={resetSB}>
                    <ListItemText primary="????????????" />
                </ListItemButton>
            </Collapse>
            <Divider />

            <ListItemButton onClick={toggleAdvancedCollapse}>
                <ListItemText primary="????????????" />
                {advancedCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={advancedCollapse} sx={{ pl: 4 }}>
                <ListItem disabled={advancedConfigUnlocked <= 8 && sbImageConfig.safeMode}>
                    <ListItemText primary="????????????" secondary={"???????????????????????????" + ((advancedConfigUnlocked <= 8 && sbImageConfig.safeMode) ? `(Spam version text to unlock)` : '')} />
                    <Switch disabled={advancedConfigUnlocked < 8 && sbImageConfig.safeMode} checked={sbImageConfig.safeMode} 
                        onChange={toggleSafeMode} />
                </ListItem>
                {/* <ListItem disabled>
                    <ListItemText primary="??????????????????" />
                    <Switch disabled checked={sbImageConfig.showDebugInfo} onChange={toggleShowDebugInfo} />
                </ListItem> */}
            </Collapse>
            <Divider />
            <ListItem onClick={unlockAdvancedConfig} sx={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
            }} disabled>
                {sbImageVersion}
            </ListItem>
            <ListItem sx={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
            }} disabled>
                {`???????????????: ${sbImageConfig.lastUpdate}`}
            </ListItem>
            <ListItem sx={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
            }} disabled>
                {`????????????: ${sbImageConfig.total}`}
            </ListItem>
            <ListItemButton onClick={openAboutDialog}>
                <ListItemText primary="??????" />
            </ListItemButton>
            <ListItemButton onClick={openUpdateLogDialog}>
                <ListItemText primary="????????????" />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleClose}>
                <ListItemText sx={{ textAlign: "end" }}>????????????</ListItemText>
            </ListItemButton>
        </List>

        <TurnOffHarmonyModeAlert open={turnOffHarmonyDialogOpen} setOpen={setTurnOffHarmonyDialogOpen} cb={confirmTurnOffHarmonyMode} />

        <UpdateLogDialog open={updateLogDialogOpen} setOpen={setUpdateLogDialogOpen} />

        <AboutDialog open={aboutDialogOpen} setOpen={setAboutDialogOpen} />

    </SwipeableDrawer>
}

export default DrawerConfigMenu;