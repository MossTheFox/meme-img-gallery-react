import { useCallback, useContext, useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ImageList, ImageListItem, Link, Pagination, Stack, Alert, AlertTitle, useTheme, useMediaQuery } from "@mui/material";
import UserContext from '../../store/UserContext';
import { getMyCollection, getMyCollectionNumberOfPages, SBImageData } from '../../scripts/SBImageAPI';
import useAsync from '../../scripts/useAsync';
import DialogLoadingIndicator from '../../ui/smallComponents/DialogLoadingIndicator';
import { useEffect } from 'react';
import { Close, Share } from '@mui/icons-material';
import SharingStatusDialog from './SharingStatusDialog';
import CollectionImageContainer from './CollectionImageContainer';
import CollectionPreviewModal from './CollectionPreviewModal';
import ShareLinkParserDialog from './ShareLinkParserDialog';

function CollectionDialog({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: (open: boolean) => void;
}) {
    const [userState] = useContext(UserContext);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));


    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | undefined>();

    const [totalPages, setTotalPages] = useState(-1);
    const [currPage, setCurrPage] = useState(-1);

    const [collection, setCollection] = useState<SBImageData[]>([]);

    const asyncGetCollectionPage = useCallback(async (signal) => {
        return await getMyCollectionNumberOfPages(signal);
    }, []);

    const getPageOnSuccess = useCallback((data: number) => {
        setTotalPages(data);
        setLoading(false);
        setCurrPage(1);
    }, []);

    const getPageOnError = useCallback((err: Error) => {
        setErr(err);
        setLoading(false);
    }, []);

    const fireGetPage = useAsync(asyncGetCollectionPage, getPageOnSuccess, getPageOnError);

    const getPageAction = useCallback(() => {
        setLoading(true);
        setErr(undefined);
        fireGetPage();
    }, [fireGetPage]);

    const asyncGetCollection = useCallback(async (signal) => {
        return await getMyCollection(currPage, signal);
    }, [currPage]);

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

    useEffect(() => {
        if (open) {
            getPageAction();
        } else {
            setCurrPage(-1);
            setTotalPages(-1);
            setCollection([]);
        }
    }, [open, getPageAction]);

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

    ///////////////////////////////////
    // 分享
    ///////////////////////////////////
    const [sharingDialogOpen, setSharingDialogOpen] = useState(false);
    const openSharingDialog = useCallback(() => {
        if (userState.isLoggedIn) {
            setSharingDialogOpen(true);
        }
    }, [userState.isLoggedIn]);

    const [shareLinkParserDialogOpen, setShareLinkParserDialogOpen] = useState(false);
    const openShareLinkParserDialog = useCallback(() => {
        setShareLinkParserDialogOpen(true);
    }, []);

    return <>
        <Dialog open={open} onClose={handleClose} fullScreen>
            <DialogLoadingIndicator loading={loading} />
            <DialogTitle><Link component="button" onClick={handleClose} aria-label="关闭"><Close fontSize="small" /></Link> 收藏与集锦</DialogTitle>
            <DialogContent>{userState.isLoggedIn ?
                <>
                    {Boolean(!err) && <>
                        {totalPages === 0 && <DialogContentText>
                            还没有收藏任何图片。
                        </DialogContentText>
                        }
                        {!loading && totalPages && currPage > 0 && <>
                            <ImageList variant="masonry"
                                cols={isMobile ? 2 : isTablet ? 4 : 6}
                            >
                                {collection.map((image, index) => <ImageListItem key={image?._id ?? index}>
                                    <CollectionImageContainer
                                        onClick={setModalImage(image?.fileName)}
                                        image={image?.fileName}
                                        imageID={image?._id}
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
                </>
                :
                <DialogContentText>
                    <Link href="/login">登录</Link>以使用收藏功能。
                </DialogContentText>}

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
                    <Box width="100%" display="flex" justifyContent={"space-between"}>
                        <Box>
                            <Button variant="contained" disabled={!userState.isLoggedIn}
                                onClick={openSharingDialog}
                                startIcon={<Share />}
                                sx={{ mr: 1 }}
                            >
                                分享
                            </Button>
                            <Button sx={{ display: "none" }} onClick={openShareLinkParserDialog}>解析分享链接</Button>
                        </Box>
                        <Button onClick={handleClose}>
                            关闭
                        </Button>
                    </Box>
                </Stack>
            </DialogActions>
        </Dialog>
        <CollectionPreviewModal image={previewModalImage} onClose={handlePreviewModalClose} />

        <SharingStatusDialog open={sharingDialogOpen} setOpen={setSharingDialogOpen} />

        <ShareLinkParserDialog open={shareLinkParserDialogOpen} setOpen={setShareLinkParserDialogOpen} />
    </>
}

export default CollectionDialog;