import * as React from 'react';
import {PageContainer} from "@toolpad/core/PageContainer";
import TicketWizard from "@/app/ui/ticket-wizard/TicketWizard";
import { Typography } from '@mui/material';

const submitForm = (submitEvent: SubmitEvent) => {
    submitEvent.preventDefault();


}

export default function NewTicketsPage() {
    return (
        <PageContainer>
            <TicketWizard />
        </PageContainer>
    );
}
