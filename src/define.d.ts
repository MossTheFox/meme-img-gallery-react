/**
 * 全局用户信息上下文
 */
interface UserContextObject {
    error: null | string;
    pending: boolean;
    isLoggedIn: boolean;
    uid: string;
    username: string;
    avatar: string;
    signature: string;
};

type UserContextDispatchAction = {
    type: "SET_USER" | "SET_DATA" | "LOGOUT" | "PENDING" | "INIT" | "BEFORE_INIT" | "ERROR" | "CLEAR_ERROR";
    payload?: any;
};

/**
 * 全局站点设置上下文
 */
interface SiteConfigContextObject {
    themeMode: "dark" | "light";
    themeFollowSystem: boolean;
    showThemeToggleButton: boolean;
    showPwaInstallButton: boolean;
    showFooter: boolean;
    navBarPosition: 'top' | 'bottom';
    disableBackdropFilter: boolean;
    [key: string]: any;
};

type SiteConfigKey = 'themeMode' | 'themeFollowSystem' | 'showThemeToggleButton' | 'showPwaInstallButton' | 'showFooter' | 'navBarPosition' | 'disableBackdropFilter';


interface ServiceCard {
    id: string;
    name: string;
    version: string;
    url: string;
    iconUrl?: string;
    bannerUrl?: string;
    tags?: string[];
    permission?: string[];      // 已登录用户的服务卡片会包含这个字段
};

interface ServiceCardDetail {
    description: string;
    tags: string[];
    updateLog: string;
};

interface CachedUserData {
    uid: string;
    username: string;
    signature?: string;
    avatar?: string;
};

interface UserCardData {
    fav: string[];
    cards: ServiceCard[];
}

/**
 * 缓存数据上下文
 */
interface CachedData {
    user: CachedUserData;
    publicCards: ServiceCard[];
    userCardData: {
        uid: string;
    } & UserCardData;
};

interface CachedDataDispatchAction {
    type: 'SET_USER' | 'LOGOUT' | 'SET_PUBLIC_CARDS' | 'SET_USER_CARD_DATA' | 'CLEAR_CACHE';
    payload?: Partial<CachedUserData> | ServiceCard[] | UserCardData | any;
};

interface EditProfileForm {
    username: string;
    signature: string;
    // avatar: "", // 由独立的图片上传模块提供
    birthday: null | string; // 和日期沾边的，特殊一点，null 代表未填写
    gender: "不设置" | "男" | "女" | "其他";
};