const apiUrl = process.env.NODE_ENV === 'production' ? 'https://api.mxowl.com' : 'http://localhost';
const appUrl = process.env.NODE_ENV === 'production' ? 'https://app.mxowl.com' : 'http://localhost:3000';

const avatarPlaceholder = "default.svg";

const avatarUrlPrefix = `https://tcdn.mxowl.com/owl-site/upload/avatar`;
const resourceUrlPrefix = `https://tcdn.mxowl.com/res`;

const defaultSiteConfig: SiteConfigContextObject = {
    themeMode: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    themeFollowSystem: true,
    showThemeToggleButton: true,
    showPwaInstallButton: true,
    showFooter: true,
    navBarPosition: 'top', // Experimental, TODO
    disableBackdropFilter: true,
};  // ⚠ localStorage 只可以存储字符串

// 读取一次当前设置，作为全局上下文的初始值
const currentConfig: SiteConfigContextObject = {
    ...defaultSiteConfig
};
let siteConfig = localStorage.getItem("siteConfig");
if (siteConfig) {
    try {
        const siteConfigObj: Partial<SiteConfigContextObject> & { [key: string]: any } = JSON.parse(siteConfig);
        if (typeof siteConfigObj === "object") {
            Object.keys(defaultSiteConfig).forEach((key) => {
                if (key in siteConfigObj && typeof siteConfigObj[key] === typeof defaultSiteConfig[key]) {
                    currentConfig[key] = siteConfigObj[key];
                }
            });
        } else {
            throw new Error("siteConfig is not an object");
        }
    } catch (e) {
        process.env.NODE_ENV === 'development' && console.error(e);
        localStorage.removeItem("siteConfig");
    }
}


const sbImageVersion = `SB Image Beta 0.7.3 (2022-08-20)`;

// TODO 悬浮按钮
// TODO2 欢迎页与引导页、集锦中的预览允许缩放

const updateLog = `更新日志
Beta 0.7.3 (2022-08-20)
· 现在可以查看到图库的更新状态了
· 默认主题禁用了背景模糊

Beta 0.7.2b (2022-05-28)
· 修正一处文字提示错误

Beta 0.7.2 (2022-05-28)
· 现在，图片载入中、载入出错的情况会有提示了
· 修复 Safari 的复制文本出错问题 (Safari 要求触发写剪切板请求必须位于用户交互 click 事件顶部的堆栈中，由此不可以用会破坏堆栈顺序的异步函数)

Beta 0.7.1 (2022-04-28)
· 修正 Safari PWA 模式下的状态栏底色，现在状态栏在浅色模式下的文字可以正常阅读了

Beta 0.7.0 (2022-03-04)
· 大屏幕设备可以自适应调整图像尺寸了
· 头像悬浮按钮可以隐藏了
· 可以在设置中调整部分图片自适应行为

Beta 0.6.9b (2022-03-02)
· 引入百度统计
· 如果不喜欢这类模块，去主站的设置界面可以永久关闭 (不跟随任何的设置重置操作，设置后永久保存)

Beta 0.6.9 (2022-03-01)
· 添加关于信息
· 查看分享的集锦会应用过滤器了
· 禁用某个模式会有附加提示

Beta 0.6.8(b) (2022-03-01)
· 设置菜单小修改
· 对于大屏幕的图片展示效果，降低了最小宽度
· 移除了未完成的设置项
· (b) 移除了下载成功提示 (特定浏览器环境下，并不能直接触发下载)

Beta 0.6.7 (2022-03-01)
· 收藏的图片在预览时可以下载了
· 微调界面按钮样式
· 移除 "解析分享链接" 对话框 (请直接通过链接访问分享的内容)

Beta 0.6.6 (2022-03-01)
· 细节修复: 分享者头像显示在特定设备上边角显示不正常
· 菜单栏的查看收藏按钮改成 ★
· 添加下载图片按钮
· 添加分享单个图片按钮
· 可以在界面设置里面隐藏下载、收藏、分享按钮了

Beta 0.6.5 (2022-02-28)
· 收藏分享可以使用了
· 同时可以从他人收藏中将图片添加到自己的收藏
· 收藏与集锦的收藏按钮触发区域增大

Beta 0.6.4 (2022-02-28)
· 修复显示的收藏数量在切换图片之后不被更新的问题

Beta 0.6.3 (2022-02-27)
· 可用在收藏与集锦里取消收藏了
· 可以显示图片被收藏的次数了
· 收藏的图片在预览时不会因为图片过长导致被裁剪了

Beta 0.6.1 (2022-02-27)
· 优化了初始化请求的加载时间
· 未登录时的收藏按钮会有提示了
· 首屏未完成加载时，背景色会跟随系统明暗主题设置

Beta 0.6.0 (2022-02-27)
· 收藏模块可用了
· 暂时还不能在收藏与集锦窗口中取消收藏
· 修复了异步 Hook 可能造成的反复发送请求的潜在问题
· 优化了预加载图片的体验
· 优化缩放卡顿现象

Beta 0.5.0 (2022-02-25)
· 功能正常，可以上线了
· 支持随机跳转、回到开头 (随机排序由服务端每天生成一次)
· 有足够的错误接管模块
· 可以保存进度，即使出错也可以
· 可以启用键盘操作
· 可以启用自动播放
· 主题设置与主站同步

Alpha Dev
· 正在测试界面布局
· 测试 Swiper.js 交互效果
· 测试全局设置项与状态
`

export { apiUrl, avatarPlaceholder, avatarUrlPrefix, resourceUrlPrefix, sbImageVersion, updateLog, defaultSiteConfig, currentConfig, appUrl };