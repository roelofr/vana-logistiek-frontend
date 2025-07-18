'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Image from 'next/image'
import {DashboardLayout, ThemeSwitcher} from '@toolpad/core/DashboardLayout';
import Copyright from '../components/Copyright';
import SidebarFooterAccount, {ToolbarAccountOverride} from './SidebarFooterAccount';
import AppConfetti from "@/app/ui/AppConfetti";
import IconButton from "@mui/material/IconButton";
import CelebrationIcon from '@mui/icons-material/Celebration';
import {fireConfetti} from "@/app/lib/confetti";
import {NoSsr} from '@mui/material';

function dispatchConfetti() {
    'use client';

    fireConfetti();
}

function CustomActions() {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="primary" aria-label="Confetti knop" onClick={dispatchConfetti}>
                <CelebrationIcon/>
            </IconButton>
            <ThemeSwitcher/>
            <ToolbarAccountOverride/>
        </Stack>
    );
}

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <React.Fragment>
            <DashboardLayout
                branding={{
                    logo: <Image src="/logo.svg" alt="Logo van de app" width={28} height={28}/>,
                    title: "LogistiekApp",
                    homeUrl: '/',
                }}
                slots={{
                    toolbarActions: CustomActions,
                    sidebarFooter: SidebarFooterAccount,
                }}
            >
                {props.children}
                <Copyright sx={{my: 4}}/>
            </DashboardLayout>

            <NoSsr>
                <AppConfetti/>
            </NoSsr>
        </React.Fragment>
    );
}
