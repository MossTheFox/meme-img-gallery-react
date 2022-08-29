import { responsiveFontSizes, createTheme } from "@mui/material";
import { currentConfig } from "../store/globalConst";

let darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#dbffa2"
        },
        secondary: {
            main: "#ffc352"
        },
        error: {
            main: "#ff6459"
        },
        warning: {
            main: "#ff893b"
        },
        info: {
            main: "#65ceff"
        },
        success: {
            main: "#5fda63"
        },
        background: {
            default: "#292726"
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorDefault: {
                    backgroundColor: "#292726"
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paperFullWidth: {
                    width: "calc(100% - 32px)",
                    maxHeight: "calc(100% - 32px)",
                    margin: "0"
                }
            }
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backdropFilter: currentConfig.disableBackdropFilter ? "none" : "blur(1px)",
                    // zIndex: "2" // 与 Swiper 控件的 zIndex: 1 区分开
                }
            }
        }
    },
    typography: {
        // fontSize: 16
    },
    shape: {
        borderRadius: 8
    },

});

darkTheme = responsiveFontSizes(darkTheme);

let lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#548142"
        },
        secondary: {
            main: "#b1832d"
        },
        error: {
            main: "#cf443a"
        },
        warning: {
            main: "#ce8028"
        },
        info: {
            main: "#4999be"
        },
        success: {
            main: "#38a13b"
        },
        background: {
            // default: "#faf9f6"    // 覆盖掉 PWA 底色
            default: "#548142"
        }
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                paperFullWidth: {
                    width: "calc(100% - 32px)",
                    maxHeight: "calc(100% - 32px)",
                    margin: "0"
                }
            }
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backdropFilter: currentConfig.disableBackdropFilter ? "none" : "blur(1px)",
                    // zIndex: "2" // 与 Swiper 控件的 zIndex: 1 区分开
                }
            }
        }
    },
    typography: {
        // fontSize: 16
    },
    shape: {
        borderRadius: 8
    },
});

lightTheme = responsiveFontSizes(lightTheme);

const theme = {
    dark: darkTheme,
    light: lightTheme
};

export { lightTheme, darkTheme, theme as themeObject };