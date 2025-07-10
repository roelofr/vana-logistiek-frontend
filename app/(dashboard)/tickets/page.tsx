import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {PageContainer} from '@toolpad/core/PageContainer';
import {Suspense} from 'react';
import {Ticket} from "@/app/domain";
import Tickets from "@/app/ui/tickets/tickets";
import AppSpeedDial from "@/app/components/AppSpeedDial";

export default async function TicketsPage() {
    // Lazy load the tickets, eventually.
    const tickets = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<Ticket[]>('/ticket'));

    return (
        <PageContainer>
            {/*<CustomDataGrid rows={rows} columns={columns}/>*/}
            <Suspense fallback={<div>Loading...</div>}>
                <Tickets tickets={tickets}/>
            </Suspense>

            <AppSpeedDial/>
        </PageContainer>
    )
}
