import {ReactNode} from 'react';
import {NextAppProvider} from '@toolpad/core/nextjs';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import type {Navigation} from '@toolpad/core/AppProvider';
import theme from '../theme';
import {SessionProvider, signIn, signOut} from 'next-auth/react';
import {auth} from "@/auth";

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        title: 'Dashboard',
        icon: <DashboardIcon/>,
    },
    {
        segment: 'tickets',
        title: 'Tickets',
        icon: <ShoppingCartIcon/>,
    },
    {
        segment: 'vendors',
        title: 'Standhouders',
        icon: <PersonIcon/>,
        pattern: 'vendors{/:vendorId}*',
    },
    {
        segment: 'users',
        title: 'Gebruikers',
        icon: <PersonIcon/>,
        pattern: 'user{/:userId}*',
    },
];

const AUTHENTICATION = {
    signIn,
    signOut,
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    const session = await auth();

    return (
        <html lang="nl" data-toolpad-color-scheme="light">
        <head>
            <title>Penis LogistiekApp</title>
        </head>
        <body>
        <SessionProvider session={session}>
            <AppRouterCacheProvider options={{enableCssLayer: true}}>
                <NextAppProvider
                    theme={theme}
                    navigation={NAVIGATION}
                    session={session}
                    authentication={AUTHENTICATION}
                >
                    {children}
                </NextAppProvider>
            </AppRouterCacheProvider>
        </SessionProvider>
        </body>
        </html>
    );
}
