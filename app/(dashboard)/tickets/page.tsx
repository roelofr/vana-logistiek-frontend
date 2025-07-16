"use server";

import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {Suspense} from 'react';
import {Ticket} from "@/app/domain";
import Tickets from "@/app/ui/tickets/tickets";
import AppSpeedDial from "@/app/components/AppSpeedDial";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PageContainerWithToolbar from "@/app/components/PageContainerWithToolbar";

function TicketToolbar() {
    return (
        <Button href="/tickets/new" variant="outlined" color="primary">
            Nieuw ticket
        </Button>
    )
}

export default async function TicketsPage() {
    // Lazy load the tickets, eventually.
    const tickets = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<Ticket[]>('/ticket'));

    return (
        <PageContainerWithToolbar toolbar={<TicketToolbar/>}>
            <Typography variant="body1" gutterBottom>
                Hieronder staan alle tickets, in totaal willekeurige volgorde (meestal op nummer, oplopend).
            </Typography>

            {/*<CustomDataGrid rows={rows} columns={columns}/>*/}

            <Suspense fallback={<div>Loading...</div>}>
                <Tickets tickets={tickets}/>
            </Suspense>

            <AppSpeedDial/>
        </PageContainerWithToolbar>
    )
}
