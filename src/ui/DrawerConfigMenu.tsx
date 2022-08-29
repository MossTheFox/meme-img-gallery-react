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
                <ListItemText primary="主题设置" />
                {themeCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={themeCollapse} sx={{ pl: 4 }}>
                <ListItemButton disabled={siteConfig.themeFollowSystem} onClick={toggleTheme}>
                    <ListItemIcon>{siteConfig.themeMode === 'dark' ? <DarkMode /> : <LightMode />}</ListItemIcon>
                    <ListItemText primary="主题模式" secondary={siteConfig.themeMode === 'dark' ? "暗色" : "亮色"} />
                </ListItemButton>
                <ListItem>
                    <ListItemText primary="主题跟随系统" secondary="以系统颜色偏好作为主题模式。" />
                    <Switch checked={siteConfig.themeFollowSystem} onChange={toggleThemeFollowSystem} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="禁用背景模糊" secondary="若影响性能，可将其关闭。将在页面刷新后生效。" />
                    <Switch checked={siteConfig.disableBackdropFilter} onChange={toggleBackdropFilter} />
                </ListItem>
            </Collapse>
            <Divider />

            <ListItemButton onClick={toggleLayoutCollapse}>
                <ListItemText primary="界面设置" />
                {layoutCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={layoutCollapse} sx={{ pl: 4 }}>
                <ListItem>
                    <ListItemText primary="显示收藏按钮" secondary="显示右侧的收藏按钮。" />
                    <Switch checked={sbImageConfig.showFavButton} onChange={toggleShowFavButton} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="显示下载按钮" secondary="显示左下角的下载按钮。" />
                    <Switch checked={sbImageConfig.showDownloadButton} onChange={toggleShowDownloadButton} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="显示分享按钮" secondary="显示右侧的分享按钮。" />
                    <Switch checked={sbImageConfig.showShareButton} onChange={toggleShowShareButton} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="显示用户头像" secondary="显示右上角的用户头像。" />
                    <Switch checked={sbImageConfig.showUserAvatar} onChange={toggleShowUserAvatar} />
                </ListItem>
            </Collapse>
            <Divider />

            <ListItemButton onClick={toggleAssistanceCollapse}>
                <ListItemText primary="辅助功能" />
                {assistanceCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={assistanceCollapse} sx={{ pl: 4 }}>
                {/* <ListItem disabled>
                    <ListItemText primary="启用点击翻页" secondary="允许点击左右边缘翻页。" />
                    <Switch disabled checked={sbImageConfig.clickToTurn} onChange={toggleClickToTurn} />
                </ListItem> */}
                <ListItem>
                    <ListItemText primary="不放大小图" secondary="对于尺寸较小的图片，显示其原始大小而不进行缩放。" />
                    <Switch checked={sbImageConfig.dontZoomSmallImages} onChange={toggleDontZoomSmallImages} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="应用设备屏幕缩放比" secondary="仅对高度溢出的图片调整时会使用。如果缩放造成文字大小不便阅读，可停用此设置。" />
                    <Switch checked={sbImageConfig.applyDevicePixelRatio} onChange={toggleApplyDevicePixelRatio} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="启用键盘控制" secondary="允许使用键盘方向键控制翻页。" />
                    <Switch checked={sbImageConfig.turnWithKeyboard} onChange={toggleTurnWithKeyboard} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="启用自动播放" secondary="可以开启在无操作时自动向后播放。" />
                    <Switch checked={sbImageConfig.autoplay} onChange={toggleAutoPlay} />
                </ListItem>
                <ListItemButton onClick={resetSB}>
                    <ListItemText primary="重置设置" />
                </ListItemButton>
            </Collapse>
            <Divider />

            <ListItemButton onClick={toggleAdvancedCollapse}>
                <ListItemText primary="高级设置" />
                {advancedCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={advancedCollapse} sx={{ pl: 4 }}>
                <ListItem disabled={advancedConfigUnlocked <= 8 && sbImageConfig.safeMode}>
                    <ListItemText primary="和谐模式" secondary={"回避不和谐的内容。" + ((advancedConfigUnlocked <= 8 && sbImageConfig.safeMode) ? `(Spam version text to unlock)` : '')} />
                    <Switch disabled={advancedConfigUnlocked < 8 && sbImageConfig.safeMode} checked={sbImageConfig.safeMode} 
                        onChange={toggleSafeMode} />
                </ListItem>
                {/* <ListItem disabled>
                    <ListItemText primary="显示调试信息" />
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
                {`最后更新于: ${sbImageConfig.lastUpdate}`}
            </ListItem>
            <ListItem sx={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
            }} disabled>
                {`图库总量: ${sbImageConfig.total}`}
            </ListItem>
            <ListItemButton onClick={openAboutDialog}>
                <ListItemText primary="关于" />
            </ListItemButton>
            <ListItemButton onClick={openUpdateLogDialog}>
                <ListItemText primary="更新日志" />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleClose}>
                <ListItemText sx={{ textAlign: "end" }}>关闭菜单</ListItemText>
            </ListItemButton>
        </List>

        <TurnOffHarmonyModeAlert open={turnOffHarmonyDialogOpen} setOpen={setTurnOffHarmonyDialogOpen} cb={confirmTurnOffHarmonyMode} />

        <UpdateLogDialog open={updateLogDialogOpen} setOpen={setUpdateLogDialogOpen} />

        <AboutDialog open={aboutDialogOpen} setOpen={setAboutDialogOpen} />

    </SwipeableDrawer>
}

export default DrawerConfigMenu;