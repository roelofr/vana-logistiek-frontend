import * as React from 'react';
import {PageContainer} from "@toolpad/core/PageContainer";
import TicketWizard from "@/app/ui/ticket-wizard/TicketWizard";

export default function NewTicketsPage() {
    return (
        <PageContainer>
            <TicketWizard/>
        </PageContainer>
    );
}
