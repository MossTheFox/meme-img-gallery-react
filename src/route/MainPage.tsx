import { Box, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class"
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/autoplay";
import ImageDisplay from "../components/ImageDisplay";
import { useCallback, useContext, useEffect, useState } from "react";
import { Zoom, Autoplay } from "swiper";
import { getFirst, getNextTen, getPrevTen, getRandom, getWithStartID, SBImageData } from "../scripts/SBImageAPI";
import useAsync from "../scripts/useAsync";
import InfoDialog from "./MainGalleryComponents/InfoDialog";
import { SBImageConfigContext } from "../store/SBImageConfigContext";
import { SBMainViewerContext } from "../store/SBMainViewerContext";
import KeyboardControl from "./MainGalleryComponents/KeyboardControl";
import AutoplayControl from "./MainGalleryComponents/AutoPlayControl";

const SwipeSlideStyle: React.CSSProperties = {
    maxHeight: "100vh",
    overflow: "auto",
};

function MainPage() {

    const [sbConfig] = useContext(SBImageConfigContext);
    const [viewerState, setViewerState, , , registerFunc] = useContext(SBMainViewerContext);

    const [viewerImageSrc, setViewerImageSrc] = useState<Array<string | string[] | undefined>>([]);

    const [swiper, setSwiper] = useState<SwiperClass | null>(null);

    const [theIndex, setTheIndex] = useState<{
        prev: number;
        curr: number;
    }>({
        prev: 0,
        curr: 0,
    });

    const [alertData, setAlertData] = useState<{
        severity: "info" | "warning" | "error" | "success";
        title: string;
        content: string;
        action?: () => void;
    } | null>(null);

    const [theData, setTheData] = useState<{
        prev: SBImageData[];
        curr: SBImageData[];
        next: SBImageData[];
    }>({
        prev: [],
        curr: [],
        next: [],
    });

    const [headAndTail, setHeadAndTail] = useState<[string, string]>(['', '']);

    useEffect(() => {
        setHeadAndTail([theData.curr[0]?._id, theData.curr[9]?._id]);
    }, [theData]);

    // =====================================================================================================================

    const onSwipe = useCallback((swiper: SwiperClass) => {
        // 进入时会触发一次
        // console.log(`${swiper.previousIndex} -> ${swiper.activeIndex}, realIndex: ${swiper.realIndex}`);
        //          0, 1 -> 1, 2 -> 2, 3 -> 0, 4 (只有三页时的向右翻页动作)
        setTheIndex((prev) => ({
            prev: prev.curr,
            curr: swiper.realIndex,
        }));
        // 只能根据 realIndex 来判断位置
        // if (swiper.previousIndex === 9 && swiper.)
    }, []);

    // =====================================================================================================================

    const asyncGetFirstAction = useCallback(async (signal) => {
        let cu = await getFirst(Boolean(sbConfig.safeMode), signal);
        if (cu?.length !== 10) {
            throw new Error("服务器可能出现了故障，没有按预期发回数据")
        }
        let pr_promise = new Promise<SBImageData[]>((resolve, reject) => {
            getPrevTen(cu[0]._id, Boolean(sbConfig.safeMode), signal).then((pr) => {
                resolve(pr);
            }).catch((err) => {
                reject(err);
            })
        });
        let ne_promise = new Promise<SBImageData[]>((resolve, reject) => {
            getNextTen(cu[9]._id, Boolean(sbConfig.safeMode), signal).then((ne) => {
                resolve(ne);
            }).catch(err => reject(err));
        });
        let [pr, ne] = await Promise.all([pr_promise, ne_promise]);
        return [pr, cu, ne];
    }, [sbConfig.safeMode]);

    const asyncGetRandomFirstAction = useCallback(async (signal) => {
        let cu = await getRandom(Boolean(sbConfig.safeMode), signal);
        if (cu?.length !== 10) {
            throw new Error("服务器可能出现了故障，没有按预期发回数据")
        }
        let pr_promise = new Promise<SBImageData[]>((resolve, reject) => {
            getPrevTen(cu[0]._id, Boolean(sbConfig.safeMode), signal).then((pr) => {
                resolve(pr);
            }).catch((err) => {
                reject(err);
            })
        });
        let ne_promise = new Promise<SBImageData[]>((resolve, reject) => {
            getNextTen(cu[9]._id, Boolean(sbConfig.safeMode), signal).then((ne) => {
                resolve(ne);
            }).catch(err => reject(err));
        });
        let [pr, ne] = await Promise.all([pr_promise, ne_promise]);
        return [pr, cu, ne];
    }, [sbConfig.safeMode]);

    const asyncGetFirstWithStartingIDAction = useCallback(async (signal) => {
        try {
            if (!viewerState.currentID) {
                throw new Error("Invalid StartID");
            }
            let cu = await getWithStartID(viewerState?.currentID, Boolean(sbConfig.safeMode), signal);
            if (cu?.length !== 10) {
                throw new Error("服务器可能出现了故障，没有按预期发回数据")
            }
            let pr_promise = new Promise<SBImageData[]>((resolve, reject) => {
                getPrevTen(cu[0]._id, Boolean(sbConfig.safeMode), signal).then((pr) => {
                    resolve(pr);
                }).catch((err) => {
                    reject(err);
                })
            });
            let ne_promise = new Promise<SBImageData[]>((resolve, reject) => {
                getNextTen(cu[9]._id, Boolean(sbConfig.safeMode), signal).then((ne) => {
                    resolve(ne);
                }).catch(err => reject(err));
            });
            let [pr, ne] = await Promise.all([pr_promise, ne_promise]);
            return [pr, cu, ne];
        } catch (err) {
            if (err && typeof err === 'object' && (err as { message?: string })?.message === "Invalid StartID") {
                return await asyncGetFirstAction(signal);
            } else {
                throw err;
            }
        }
    }, [sbConfig.safeMode, viewerState, asyncGetFirstAction]);

    const getFirstOnSuccess = useCallback((data: Array<SBImageData[]>) => {
        setAlertData(null);
        setTheData({
            prev: data[0],
            curr: data[1],
            next: data[2],
        });
    }, []);

    const getFirstOnError = useCallback((error: Error) => {
        setAlertData({
            severity: "error",
            title: "初始化时发生错误",
            content: `错误信息: ${error?.message}`,
        });
    }, []);

    const fireGetFirst = useAsync(asyncGetFirstAction, getFirstOnSuccess, getFirstOnError);
    const fireGetRandomFirst = useAsync(asyncGetRandomFirstAction, getFirstOnSuccess, getFirstOnError);
    const fireGetFirstWithStartingID = useAsync(asyncGetFirstWithStartingIDAction, getFirstOnSuccess, getFirstOnError);

    // 这个函数很多地方都有在用，且注册到了全局上下文
    // ★★★★★★★★★★★★★★★★★★★★★★★★
    const initAction = useCallback((doRandom = false, ignoreSavedProgress = false, startAt?: string) => {
        swiper?.slideTo(1, 0);
        setTheData({
            prev: [],
            curr: [],
            next: [],
        });
        setAlertData({
            severity: "info",
            title: "初始化中",
            content: "请稍等一下..."
        });
        if (doRandom) { // 随机走
            fireGetRandomFirst();
            return;
        }
        if (ignoreSavedProgress) {  // 从首个开始
            fireGetFirst();
            return;
        }
        if (startAt) {  // 指定开始位置
            setViewerState("currentID", startAt);
            fireGetFirstWithStartingID();
            return;
        }
        fireGetFirstWithStartingID();   // 默认：读取进度

    }, [fireGetFirst, fireGetRandomFirst, swiper, fireGetFirstWithStartingID, setViewerState]);

    const initActionWhenError = useCallback(() => {
        initAction();
    }, [initAction]);

    // =====================================================================================================================

    // 初始化，只执行一次
    useEffect(() => {
        initAction();
    }, [initAction]);

    // 注册这个初始化函数到全局
    useEffect(() => {
        registerFunc(initAction, "reset");
    }, [initAction, registerFunc]);

    const setCurrentFav = useCallback((bool: boolean) => {
        setTheData((prev) => {
            if (!prev.curr[theIndex.curr]) {
                return prev;
            }
            prev.curr[theIndex.curr].fav = bool;
            if (prev.curr[theIndex.curr]?.favTimes === undefined) {
                prev.curr[theIndex.curr].favTimes = 0;
            }
            prev.curr[theIndex.curr]!.favTimes! += bool ? 1 : -1;       // 更新列表里 favTimes
            return prev;
        });
        setViewerState("fav", bool);
    }, [theIndex, setViewerState]);

    // 注册
    useEffect(() => {
        registerFunc(setCurrentFav, "setFav");
    }, [setCurrentFav, registerFunc]);

    // =====================================================================================================================

    const asyncGetNext = useCallback(async (signal) => {
        if (!headAndTail[1]) {
            throw new Error("图组没有在预期的时间内结束预载");
        }
        return await getNextTen(headAndTail[1], Boolean(sbConfig.safeMode), signal);
    }, [headAndTail, sbConfig.safeMode]);

    const getNextOnSuccess = useCallback((data: SBImageData[]) => {
        setAlertData(null);
        setTheData((prev) => ({
            ...prev,
            next: data,
        }));
    }, []);

    const getNextOnError = useCallback((error: Error) => {
        setAlertData({
            severity: "error",
            title: "载入图组时出错",
            content: `错误信息: ${error.message}`
        });
    }, []);

    const fireGetNext = useAsync(asyncGetNext, getNextOnSuccess, getNextOnError);

    // =====================================================================================================================

    const asyncGetPrev = useCallback(async (signal) => {
        if (!headAndTail[0]) {
            throw new Error("图组没有在预期的时间内结束预载");
        }
        return await getPrevTen(headAndTail[0], Boolean(sbConfig.safeMode), signal);
    }, [headAndTail, sbConfig.safeMode]);

    const getPrevOnSuccess = useCallback((data: SBImageData[]) => {
        setAlertData(null);
        setTheData((prev) => ({
            ...prev,
            prev: data,
        }));
    }, []);

    const getPrevOnError = useCallback((error: Error) => {
        setAlertData({
            severity: "error",
            title: "载入图组时出错",
            content: `错误信息: ${error.message}`
        });
    }, []);

    const fireGetPrev = useAsync(asyncGetPrev, getPrevOnSuccess, getPrevOnError);

    // =====================================================================================================================

    // 翻页后的变化
    useEffect(() => {
        // 1. 更新缓存记录的图片 ID
        // 2. 在特定情况下进行预载
        process.env.NODE_ENV === "development" && console.log(`[PRELOAD] currentIndex: ${theIndex.curr}, prevIndex: ${theIndex.prev}`);
        if (theIndex.curr === theIndex.prev) {
            return; // 排除
        }
        if (theIndex.prev === 9 && theIndex.curr === 0) {
            // 后翻
            setTheData((prev) => ({
                prev: prev.curr,
                curr: prev.next,
                next: [],
            }));
        } else if (theIndex.prev === 0 && theIndex.curr === 9) {
            // 前翻
            setTheData((prev) => ({
                prev: [],
                curr: prev.prev,
                next: prev.curr,
            }));
        }
    }, [theIndex]);

    // 翻页时更新缓存的位置信息
    useEffect(() => {
        // if (theIndex.curr === theIndex.prev) {
        //     return; // 不排除了
        // }
        // 考虑到 theIndex 会先改变、theData 延后一个回合，要检查边缘情况
        // >> 前翻或后翻跨页，等待一回合，并清除翻页动作记录
        // >> (反正能用)
        if ((theIndex.prev === 0 && theIndex.curr === 9) || (theIndex.prev === 9 && theIndex.curr === 0)) {
            setTheIndex((prev) => ({
                prev: prev.curr,
                curr: prev.curr
            }));
            return;
        }
        if (theData.curr[theIndex.curr] && theData.curr[theIndex.curr]._id && theData.curr[theIndex.curr].fileName) {
            setViewerState("currentID", theData.curr[theIndex.curr]._id);
            setViewerState("currentFileName", theData.curr[theIndex.curr].fileName);
            setViewerState("lastTime", Date.now());
            setViewerState("fav", Boolean(theData.curr[theIndex.curr].fav));
            setViewerState("favTimes", theData.curr[theIndex.curr].favTimes);
            process.env.NODE_ENV === "development" && console.log(`[PROCESS SAVED] currentID: ${theData.curr[theIndex.curr]._id}, currentFileName: ${theData.curr[theIndex.curr].fileName}`);
        }
    }, [theIndex, theData, setViewerState]);

    // 发现空数组则预载
    useEffect(() => {
        // 不干预初始化
        if (theData.curr.length === 0) {
            return;
        }

        if (theData.prev.length === 0) {
            fireGetPrev();
        }
        if (theData.next.length === 0) {
            fireGetNext();
        }
    }, [theData, fireGetPrev, fireGetNext]);

    // =====================================================================================================================

    // 根据当前位置更换 viewerSrc
    useEffect(() => {
        let theArray: Array<string | string[] | undefined> = new Array(10);
        let curr = theIndex.curr;
        for (let i = curr - 4; i <= curr + 4; i++) {
            if (i < 0) {
                theArray[i + 10] = theData.prev[i + 10]?.fileName;
            } else if (i > 9) {
                theArray[i - 10] = theData.next[i - 10]?.fileName;
            } else {
                theArray[i] = theData.curr[i]?.fileName;
            }
        }
        setViewerImageSrc(theArray);
    }, [theIndex, theData]);

    return <Container maxWidth="lg" disableGutters>
        <Box height="100vh" overflow="auto" sx={{
            backgroundColor: (theme) => theme.palette.background.paper
        }}>
            <Swiper
                zoom={true}
                modules={[Zoom, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                onSlideChange={onSwipe}
                onSwiper={setSwiper}
                autoplay={sbConfig.autoplay ? {
                    delay: Number(sbConfig.autoplayDuration),
                    disableOnInteraction: false,
                } : undefined}
            >
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[0]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[1]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[2]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[3]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[4]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[5]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[6]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[7]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[8]} />
                </SwiperSlide>
                <SwiperSlide style={SwipeSlideStyle}>
                    <ImageDisplay image={viewerImageSrc[9]} />
                </SwiperSlide>
            </Swiper>
        </Box>

        <InfoDialog alertData={alertData} initAction={initActionWhenError} />

        <KeyboardControl swiper={swiper} enabled={sbConfig.turnWithKeyboard} />

        <AutoplayControl enabled={sbConfig.autoplay && !Boolean(alertData?.title)} swiper={swiper} />


    </Container>
}

export default MainPage;