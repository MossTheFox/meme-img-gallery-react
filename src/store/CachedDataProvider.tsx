import { useCallback, useEffect, useReducer } from "react";
import CachedDataContext from "./CachedDataContext";

const defaultState = {};

function reducer(prevState: any, action: CachedDataDispatchAction) {
    switch (action.type) {
        case 'SET_USER':
            let userObject = {
                uid: action.payload?.uid,
                username: action.payload?.username,
                avatar: action.payload?.avatar || "",
                signature: action.payload?.signature || "",
            };
            localStorage.setItem('user', JSON.stringify(userObject));
            return {
                ...prevState,
                user: userObject
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return {
                publicCards: prevState.publicCards || []
            };
        case 'SET_PUBLIC_CARDS':
            let cardArray = action.payload;
            localStorage.setItem('publicCards', JSON.stringify(cardArray));
            return {
                ...prevState,
                publicCards: cardArray
            };
        case 'SET_USER_CARD_DATA':
            let userCardData = {
                uid: prevState.user?.uid,
                ...action.payload
            };
            localStorage.setItem('userCardData', JSON.stringify(userCardData));
            return {
                ...prevState,
                userCardData
            };
        case 'CLEAR_CACHE':
            localStorage.removeItem('user');
            localStorage.removeItem('publicCards');
            localStorage.removeItem('userCardData');
            return defaultState;
        default:
            return prevState;
    }
}

function CachedDataProvider({ children }: { children: React.ReactNode }) {
    const [cachedData, dispatch] = useReducer(reducer, {});

    // 初始化一次
    useEffect(() => {
        let user = localStorage.getItem('user');
        let publicCardArrayStr = localStorage.getItem('publicCards');
        let userCardDataStr = localStorage.getItem('userCardData');
        if (user) {
            try {
                let userObject = JSON.parse(user);
                dispatch({
                    type: 'SET_USER',
                    payload: userObject
                });
            } catch (e) {
                process.env.NODE_ENV === 'development' && console.error(e);
                localStorage.removeItem('user');
            }
        }
        if (publicCardArrayStr) {
            try {
                let publicCards = JSON.parse(publicCardArrayStr);
                dispatch({
                    type: 'SET_PUBLIC_CARDS',
                    payload: publicCards
                });
            } catch (e) {
                process.env.NODE_ENV === 'development' && console.error(e);
                localStorage.removeItem('publicCards');
            }
        }
        if (userCardDataStr) {
            try {
                let userCardData = JSON.parse(userCardDataStr);
                dispatch({
                    type: 'SET_USER_CARD_DATA',
                    payload: userCardData
                });
            } catch (e) {
                process.env.NODE_ENV === 'development' && console.error(e);
                localStorage.removeItem('userCardData');
            }
        }
    }, []);

    // 从 localStorage 中取值
    const get = useCallback((key) => {
        let data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }, []);

    return <CachedDataContext.Provider value={[cachedData, dispatch, get]}>
        {children}
    </CachedDataContext.Provider>
}

export default CachedDataProvider;