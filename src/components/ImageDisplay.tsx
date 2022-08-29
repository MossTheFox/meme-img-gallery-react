import { Box, CircularProgress, useTheme, useMediaQuery, Alert, Button } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SBImageConfigContext } from "../store/SBImageConfigContext";
import { SB_IMG_URL_PREFIX } from "../store/SBMainViewerProvider";


function ImageDisplay({
    image,
    onClick,
}: {
    image: string | string[] | undefined;
    onClick?: () => void;
}) {
    const [sbSettings] = useContext(SBImageConfigContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });


    const [imageLoaded, setImageLoaded] = useState<false | true | 'err'>(false);
    const [imageLoadFailedText, setImageLoadFailedText] = useState<string | undefined>(undefined);

    // 在此组件内部，统一用 imageData
    const [imageData, setImageData] = useState(image);
    useEffect(() => {
        setImageData(image);
        setImageLoaded(false);
    }, [image]);

    const reloadImage = useCallback(() => {
        setImageLoaded(false);
    }, []);

    useEffect(() => {
        if (imageData && imageLoaded === false) {
            if (Array.isArray(imageData)) {
                // do nothing
                setImageLoaded(true);
            } else {
                let img = new Image();
                img.onload = () => {
                    process.env.NODE_ENV === "development" && console.log("ImageDisplay:", img.naturalWidth, img.naturalHeight);
                    if (img.naturalHeight > 0 && img.naturalWidth > 0) {
                        setImageSize({
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                        });
                        setImageLoaded(true);
                    } else {
                        setImageLoaded('err');
                        setImageLoadFailedText('不支持的图片格式、或图片损坏');
                    }
                }
                img.onerror = () => {
                    setImageLoaded('err');
                    setImageLoadFailedText('加载失败');
                }
                img.src = `${SB_IMG_URL_PREFIX}/${imageData}`;
                return () => {
                    process.env.NODE_ENV === "development" && console.log("ImageDisplay:", "cleanup");
                    img.onload = null;
                    img.onerror = null;
                }
            }
        }
    }, [imageData, imageLoaded]);

    const imgStyle: React.CSSProperties = useMemo(() => {
        let defaultStyle: React.CSSProperties = {
            maxWidth: "100%",
            display: "block",
        };

        if (Array.isArray(imageData)) {
            defaultStyle.paddingBottom = "1rem"
        }

        if (imageSize.height === 0) {   // image not loaded yet
            return defaultStyle;
        }

        let windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        let containerWidth = Math.min(windowSize.width, theme.breakpoints.values.lg);
        let containerHeight = windowSize.height - 16;
        let devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio > 2) {
            devicePixelRatio = 2;
        }


        let ratio = imageSize.width / imageSize.height;

        // 对小图进行缩放
        if (imageSize.width < containerWidth && imageSize.height < containerHeight && !sbSettings.dontZoomSmallImages) {
            defaultStyle.width = Math.max(ratio * containerHeight - 32, 32);
            // defaultStyle.height = containerHeight;
            return defaultStyle;
        }

        // 对过高的图片进行一下自适应
        if (imageSize.height > containerHeight) {
            if (!isMobile) {    // 对于大屏幕设备进行一下自适应
                if (ratio > 0.5) {  // 非超长图片的情况
                    defaultStyle.width = ratio * containerHeight - 32;
                } else if (sbSettings.applyDevicePixelRatio && imageSize.height / devicePixelRatio < windowSize.height + 256) { // 稍长图
                    defaultStyle.maxHeight = "calc(100vh - 16px)";
                } else {
                    // 超长图
                    // ...如果有应用设备缩放比，那就调整一下宽度
                    if (sbSettings.applyDevicePixelRatio) {
                        defaultStyle.width = Math.min(imageSize.width / devicePixelRatio, containerWidth);
                    }
                }
            }
        }
        return defaultStyle;
    }, [isMobile, sbSettings, imageSize, imageData, theme]);


    return <Box {...onClick ? { onClick } : {}}
        // 宽度由父元素决定，Box 会自动计算宽度 (填充)
        className="swiper-zoom-container"   // Slider.js Zoom 组件需要
    >
        <Box p={"8px"}
            className="swiper-zoom-target" // 对于整个 Container 进行缩放
            minHeight="calc(100vh - 16px)"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        // sx={{
        //     filter: "brightness(0.8)",   TODO 深色模式下可选削暗图片
        // }}
        >{imageLoaded === 'err' ?
            <Alert severity="error" variant="filled" action={<Button color="inherit" size="small" onClick={reloadImage}>重试</Button>}>
                图片载入出错 {imageLoadFailedText ? `(${imageLoadFailedText})` : ""}
            </Alert> :
            imageLoaded === false ? <CircularProgress aria-label="Loading" /> :
                Boolean(imageData) ? (

                    Array.isArray(imageData) ? imageData.map((img, index) => (
                        <img key={index} src={`${SB_IMG_URL_PREFIX}/${img}`} alt={`IMG - ${img}`} style={imgStyle} />
                    )) : <img src={`${SB_IMG_URL_PREFIX}/${imageData}`} alt={`IMG - ${imageData}`} style={imgStyle} />
                ) : null
            }
        </Box>
    </Box>
}

export default ImageDisplay;