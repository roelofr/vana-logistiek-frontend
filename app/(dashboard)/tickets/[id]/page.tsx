"use server";

import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {Suspense} from 'react';
import {Ticket} from "@/app/domain";
import AppSpeedDial from "@/app/components/AppSpeedDial";
import Typography from "@mui/material/Typography";
import PageContainerWithToolbar from "@/app/components/PageContainerWithToolbar";
import TicketView from "@/app/ui/TicketView";
import TicketViewMenu from "@/app/ui/TicketViewMenu";


interface UrlParams {
    id: number;
}

interface PageParams {
    params: Promise<UrlParams>
}

export default async function Page({params}: PageParams) {
    const {id} = await params;

    // Lazy load the ticket, eventually.
    const ticket = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<Ticket>(`/ticket/${id}`));

    return (
        <PageContainerWithToolbar title={`Ticket ${id}`} toolbar={<TicketViewMenu id={id}/>}>
            <Typography variant="body1" gutterBottom>
                Hieronder staan de details van het ticket.
            </Typography>

            <Suspense fallback={<div>Loading...</div>}>
                <TicketView ticket={ticket}/>
            </Suspense>

            <AppSpeedDial/>
        </PageContainerWithToolbar>
    )
}
