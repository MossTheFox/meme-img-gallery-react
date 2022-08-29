import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import SharingLinkHandler from './components/SharingLinkHandler';
import MainPage from './route/MainPage';
import CachedDataProvider from './store/CachedDataProvider';
import SBImageConfigProvider from './store/SBImageConfigProvider';
import SBMainViewerProvider from './store/SBMainViewerProvider';
import SiteConfigProvider from './store/SiteConfigProvider';
import UserProvider from './store/UserProvider';
import MainContainer from './ui/MainContainer';
import NavigationController from './ui/NavigationController';

ReactDOM.render(
    <React.StrictMode>
        <CachedDataProvider>
            <SiteConfigProvider>
                <UserProvider>
                    <SBImageConfigProvider>
                        <SBMainViewerProvider>
                            <CssBaseline>
                                <MainContainer>
                                    <SharingLinkHandler />
                                    <MainPage />
                                    <NavigationController />
                                </MainContainer>
                            </CssBaseline>
                        </SBMainViewerProvider>
                    </SBImageConfigProvider>
                </UserProvider>
            </SiteConfigProvider>
        </CachedDataProvider>
    </React.StrictMode>,
    document.getElementById('root')
);