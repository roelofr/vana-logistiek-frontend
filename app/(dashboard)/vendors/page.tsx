'use server';

import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {PageContainer} from '@toolpad/core/PageContainer';
import {Suspense} from 'react';
import {Ticket} from "@/app/domain";
import Tickets from "@/app/ui/tickets/tickets";

export default function VendorPage() {
    // Lazy load the tickets, eventually.
    const tickets = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<Ticket[]>('/ticket'));

    return (
        <PageContainer>
            <Suspense fallback={<div>Loading...</div>}>
                <Tickets tickets={tickets}/>
            </Suspense>
        </PageContainer>
    )
}
