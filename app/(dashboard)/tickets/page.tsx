'use server';

import * as React from 'react';
import {Suspense} from 'react';
import {PageContainer} from '@toolpad/core/PageContainer';
import {auth} from "@/auth";
import {Ticket} from "@/app/domain";
import Tickets from "@/app/ui/tickets/tickets";
import {ApiStore} from "@/app/stores/apiStore";
import VendorPicker from "@/app/components/pickers/VendorPicker";
import UserPicker from "@/app/components/pickers/UserPicker";

export default async function TicketsPage() {
    const session = await auth()
    const api = new ApiStore(session)

    // Lazy-load the ticket
    const tickets = api.get<Ticket[]>('/ticket');

    return (
        <PageContainer>
            {/*<CustomDataGrid rows={rows} columns={columns}/>*/}
            <Suspense fallback={<div>Loading...</div>}>
                <Tickets tickets={tickets}/>
            </Suspense>

            <VendorPicker/>

            <UserPicker/>
        </PageContainer>
    )
}
