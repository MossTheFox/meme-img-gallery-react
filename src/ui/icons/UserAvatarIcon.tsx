import { AccountCircle } from "@mui/icons-material";
import { Avatar, Icon } from "@mui/material";
import { useContext } from "react";
import { avatarUrlPrefix } from "../../store/globalConst";
import UserContext from "../../store/UserContext"

function UserAvatarIcon() {
    const [userState] = useContext(UserContext);

    return <Icon>
        {userState.avatar ? <Avatar src={`${avatarUrlPrefix}/${userState.avatar}`} sx={{
            height: "100%",
            width: "100%",
            display: "block"
        }} />
            : <AccountCircle sx={{
                height: "100%",
                width: "100%",
                display: "block"
            }} />
        }
    </Icon>
}

export default UserAvatarIcon;