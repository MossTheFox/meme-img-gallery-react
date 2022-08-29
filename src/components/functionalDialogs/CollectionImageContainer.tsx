import { Box, ButtonBase } from "@mui/material";
import { SB_IMG_URL_PREFIX } from "../../store/SBMainViewerProvider";
import FavAndUnfavBadge from "../FavAndUnfavBadge";

const imgStyle: React.CSSProperties = {
    maxWidth: "100%",
};

function CollectionImageContainer({
    image,
    imageID,
    onClick,
    isFav = true,
}: {
    image: string | string[];
    imageID: string;
    onClick?: () => void;
    isFav?: boolean;
}) {
    return <Box position="relative">
        <ButtonBase
            {...onClick ? { onClick } : {}}
            sx={{
                borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                overflow: "hidden",
                border: (theme) => `1px solid ${theme.palette.divider}`,
            }}>
            {Array.isArray(image) ? image.map((img, index) => (
                <img key={index} src={`${SB_IMG_URL_PREFIX}/${img}`} alt="" style={imgStyle} />
            )) : <img src={`${SB_IMG_URL_PREFIX}/${image}`} alt="" style={imgStyle}
            />}
        </ButtonBase>
        <FavAndUnfavBadge imgID={imageID} isFav={isFav} />
    </Box>
}

export default CollectionImageContainer;