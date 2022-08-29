// import { Navigate, useRoutes } from "react-router-dom";
// import CollectionPage from "./route/CollectionPage";
// import UserPage from "./route/UserPage";
import Main from "./route/MainPage";

// const MainRoutes = () => useRoutes([
//     {
//         path: "/main",
//         element: <Main />
//     },
//     {
//         path: "/me",
//         element: <UserPage />
//     },
//     {
//         path: "/collection",
//         element: <CollectionPage />
//     },
//     {
//         path: "*",
//         element: <Navigate to="/main" />
//     },
// ])

function PageRoutes() {
    // TODO Prefix (/service/sb-img/)
    return <Main />
}
export default PageRoutes;