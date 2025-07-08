import * as React from 'react';
import {PageContainer} from '@toolpad/core/PageContainer';
import DashboardContent from './DashboardContent';
import AppSpeedDial from "@/app/components/AppSpeedDial";

export default function Dashboard() {
    return (
        <PageContainer>
            <DashboardContent/>

            <AppSpeedDial />
        </PageContainer>
    );
}
