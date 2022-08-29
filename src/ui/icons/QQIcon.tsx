import { Icon } from "@mui/material";
import { resourceUrlPrefix } from "../../store/globalConst";

function QQIcon({ props }: { props?: any }) {
    return <Icon {...props}>
        <img src={`${resourceUrlPrefix}/qq.svg`} alt="QQ" style={{ width: "100%", height: "100%", display: "block" }} />
    </Icon>
}

export default QQIcon;