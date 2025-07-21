import * as React from 'react';
import {PageContainer} from '@toolpad/core/PageContainer';
import AppSpeedDial from "@/app/components/AppSpeedDial";
import Typography from "@mui/material/Typography";

export default function Dashboard() {
    return (
        <PageContainer>
            <Typography variant="body1">
                Hey, welkom in de Logistiek-app. Als je net een account hebt gemaakt, kan je nog niks.<br/>
                Vraag Tessa om de nodige rechten, dan komt het vast goed.
            </Typography>

            <AppSpeedDial/>
        </PageContainer>
    );
}
