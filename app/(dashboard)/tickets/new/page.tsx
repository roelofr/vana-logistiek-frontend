import * as React from 'react';
import {PageContainer} from "@toolpad/core/PageContainer";
import TicketWizard from "@/app/ui/ticket-wizard/TicketWizard";
import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {Vendor} from "@/app/domain";

export default function NewTicketsPage() {
    const vendors = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<Vendor[]>('/vendor'));

    return (
        <PageContainer>
            <TicketWizard vendors={vendors}/>
        </PageContainer>
    );
}
