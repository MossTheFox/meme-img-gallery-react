import { useCallback, useContext, useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ImageList, ImageListItem, Link, Pagination, Stack, Alert, AlertTitle, useTheme, useMediaQuery, Avatar, Typography } from "@mui/material";
import { getSharedCollection, getSharedCollectionInfo, SBImageData, SharedCollectionInfoRes, UserInfoCard } from '../../scripts/SBImageAPI';
import useAsync from '../../scripts/useAsync';
import DialogLoadingIndicator from '../../ui/smallComponents/DialogLoadingIndicator';
import { useEffect } from 'react';
import { Close } from '@mui/icons-material';
import CollectionImageContainer from './CollectionImageContainer';
import CollectionPreviewModal from './CollectionPreviewModal';
import { avatarPlaceholder, avatarUrlPrefix } from '../../store/globalConst';
import { SBImageConfigContext } from '../../store/SBImageConfigContext';

function SharedCollectionDialog({
    open,
    setOpen,
    token
}: {
    open: boolean,
    setOpen: (open: boolean) => void;
    token: string;
}) {
    const [sbSiteConfig] = useContext(SBImageConfigContext);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | undefined>();

    const [totalPages, setTotalPages] = useState(-1);
    const [currPage, setCurrPage] = useState(-1);
    const [sharedBy, setSharedBy] = useState<UserInfoCard>({
        uid: "-1",
        username: ""
    });

    const [collection, setCollection] = useState<SBImageData[]>([]);

    const asyncGetCollectionInfo = useCallback(async (signal) => {
        return await getSharedCollectionInfo(token, sbSiteConfig.safeMode, signal);
    }, [token, sbSiteConfig.safeMode]);

    const getInfoOnSuccess = useCallback((data: SharedCollectionInfoRes) => {
        setTotalPages(data.pages);
        setSharedBy(data.userInfo);
        setLoading(false);
        setCurrPage(1);
    }, []);

    const getInfoOnError = useCallback((err: Error) => {
        setErr(err);
        setLoading(false);
    }, []);

    const fireGetInfo = useAsync(asyncGetCollectionInfo, getInfoOnSuccess, getInfoOnError);

    const getPageAction = useCallback(() => {
        setLoading(true);
        setErr(undefined);
        fireGetInfo();
    }, [fireGetInfo]);

    const asyncGetCollection = useCallback(async (signal) => {
        return await getSharedCollection(token, currPage, sbSiteConfig.safeMode, signal);
    }, [currPage, token, sbSiteConfig.safeMode]);

    const getCollectionOnSuccess = useCallback((data: SBImageData[]) => {
        setCollection(data);
        setLoading(false);
    }, []);

    const getCollectionOnError = useCallback((err: Error) => {
        setErr(err);
        setLoading(false);
    }, []);

    const fireGetCollection = useAsync(asyncGetCollection, getCollectionOnSuccess, getCollectionOnError);

    const getCollectionAction = useCallback(() => {
        setLoading(true);
        setErr(undefined);
        fireGetCollection();
    }, [fireGetCollection]);

    useEffect(() => {
        // console.log("TURNed", currPage);
        if (currPage > 0) {
            getCollectionAction();
        }
    }, [currPage, getCollectionAction]);

    const reload = useCallback(() => {
        setCurrPage(-1);
        setTotalPages(-1);
        getPageAction();
        setCollection([]);
    }, [getPageAction]);

    // 初始化
    useEffect(() => {
        if (open && token) {
            getPageAction();
        } else {
            setCurrPage(-1);
            setTotalPages(-1);
            setCollection([]);
        }
    }, [open, getPageAction, token]);

    const paginationOnChange = useCallback((e: any, page: number) => {
        setCurrPage(page);
    }, []);

    const [previewModalImage, setPreviewModalImage] = useState<string | string[] | undefined>();

    const setModalImage = useCallback((image: string | string[]) => () => {
        setPreviewModalImage(image);
    }, []);
    const handlePreviewModalClose = useCallback(() => {
        setPreviewModalImage(undefined);
    }, []);

    return <>
        <Dialog open={open} onClose={handleClose} fullScreen>
            <DialogLoadingIndicator loading={loading} />
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
                <Link component="button" onClick={handleClose} aria-label="关闭" sx={{ pr: 1 }}><Close fontSize="small" /></Link>
                {sharedBy.uid !== "-1" ? <>
                    <Typography variant="inherit" component="span" whiteSpace="nowrap">
                        来自
                    </Typography>
                    <Avatar alt={`${sharedBy.username} avatar`}
                        src={`${avatarUrlPrefix}/${sharedBy?.avatar || avatarPlaceholder}`}
                        sx={{
                            display: "inline-block",
                            width: "2rem",
                            height: "2rem",
                            m: "1px",
                            ml: 1,
                        }}
                    />
                    <Typography variant="inherit" component="span" sx={{ lineBreak: "anywhere" }} px={1}>
                        {sharedBy.username.length > 22 ? sharedBy.username.slice(0, 20) + "..." : sharedBy.username}
                    </Typography>
                    <Typography variant="inherit" component="span" whiteSpace="nowrap">
                        的集锦分享
                    </Typography>
                </> : "分享的集锦"}
            </DialogTitle>
            <DialogContent>
                {Boolean(!err) && <>
                    {totalPages === 0 && <DialogContentText>
                        当前集锦为空。
                    </DialogContentText>
                    }
                    {!loading && Boolean(totalPages) && currPage > 0 && <>
                        <ImageList variant="masonry"
                            cols={isMobile ? 2 : isTablet ? 4 : 6}
                        >
                            {collection.map((image, index) => <ImageListItem key={image?._id ?? index}>
                                <CollectionImageContainer
                                    onClick={setModalImage(image?.fileName)}
                                    image={image?.fileName}
                                    imageID={image?._id}
                                    isFav={image?.fav ?? false}
                                />
                            </ImageListItem>)}
                        </ImageList>
                    </>}
                </>}
                {Boolean(err) && <Alert variant='filled' severity='error'
                    action={<Button color="inherit" onClick={reload}>重试</Button>}
                >
                    <AlertTitle>获取内容时出错</AlertTitle>
                    {`错误信息: ${err?.message}`}
                </Alert>}

            </DialogContent>
            <DialogActions>
                <Stack spacing={1} width="100%" alignItems={"center"}>
                    {totalPages > 0 &&
                        <Pagination count={totalPages}
                            page={currPage}
                            disabled={loading}
                            onChange={paginationOnChange}
                            color="primary"
                        />
                    }
                    <Box width="100%" display="flex" justifyContent={"flex-end"}>
                        <Button onClick={handleClose}>
                            关闭
                        </Button>
                    </Box>
                </Stack>
            </DialogActions>
        </Dialog>
        <CollectionPreviewModal image={previewModalImage} onClose={handlePreviewModalClose} />
    </>
}

export default SharedCollectionDialog;