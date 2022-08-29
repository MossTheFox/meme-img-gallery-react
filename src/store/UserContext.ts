import React, { createContext } from "react";

// 不知为啥从 UserProvider.js 中 import 进来
// 会出现 Cannot access 'defaultState' before initialization 错误
const defaultState: UserContextObject = {
    error: null,
    pending: false,
    isLoggedIn: false,
    // 缓存只做这几个属性
    uid: "",
    username: "",
    avatar: "",
    signature: ""
    // 生日、性别、账户绑定的信息不做处理
};

const UserContext = createContext<[
    UserContextObject,
    React.Dispatch<UserContextDispatchAction>,
    (bool?: boolean) => void,
    (bool: boolean) => void
]>([
    // 实际值在 UserProvider.js 中，这里只是声明
    // state: 
    {
        ...defaultState,
        pending: true   // 只在页面初始化时设置为 true
    },
    // dispatch: 
    () => { },
    /** 重新获取用户信息，可用于个人资料变动后更新全局数据 */
    // refresh，参数为 true 则重置页面: 
    (bool) => { },
    (bool) => { }
]);

export default UserContext;