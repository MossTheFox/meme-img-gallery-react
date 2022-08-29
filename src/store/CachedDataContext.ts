import React, { createContext } from "react";

const CachedDataContext = createContext<[
    CachedData,
    React.Dispatch<CachedDataDispatchAction>,
    (key: string) => any
]>([
    {
        user: {
            uid: '',
            username: '',
            signature: '',
            avatar: '',
        },
        publicCards: [],
        userCardData: {
            uid: '',
            fav: [],
            cards: []
        }
    },
    () => { },
    () => { }
]);

export default CachedDataContext;