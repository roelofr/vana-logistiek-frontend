"use server";

import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {Ticket, TicketAttachment} from "@/app/domain";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TicketTimeline from "@/app/components/tickets/TicketTimeline";
import {EntityType} from "@/app/lib/resolver";
import {PageContainer} from '@toolpad/core/PageContainer';
import TicketActions from "@/app/components/tickets/TicketActions";
import TicketComment from "@/app/components/tickets/TicketComment";
import Well from "@/app/components/Well";
import VendorBadge from "@/app/components/badges/VendorBadge";
import UserBadge from "@/app/components/badges/UserBadge";
import StatusBadge from "@/app/components/badges/StatusBadge";
import DistrictBadge from "@/app/components/badges/DistrictBadge";

export interface TicketPageUrlParams {
    id: number;
}

interface PageParams {
    params: Promise<TicketPageUrlParams>
}

export default async function Page({params}: PageParams) {
    const {id} = await params;

    const session = await auth();
    const api = new ApiStore(session);

    const ticketPromise = api.getData<Ticket>(`/ticket/${id}`);
    const attachmentsPromise = api.getResolved<TicketAttachment>(EntityType.TicketAttachment, `/ticket/${id}/attachment`);

    const [ticket, attachments] = await Promise.all([
        ticketPromise,
        attachmentsPromise,
    ]);

    console.log('Ticket = %o, attachments = %o', ticket, attachments);

    const ticketDescription = ticket.data ? ticket.data.details as string : null;

    return (
        <PageContainer title={`#${ticket.id} - ${ticket.description}`}>
            <Stack direction="row" spacing={2} sx={{mb: 2}}>
                <VendorBadge vendor={ticket.vendor!}/>
                <StatusBadge status={ticket.status}/>
                <UserBadge user={ticket.creator!}/>
                <DistrictBadge district={ticket.vendor?.district ?? null}/>
            </Stack>

            <Well>
                <Typography variant="body1">
                    {ticketDescription ?? <em>Geen omschrijving</em>}
                </Typography>
            </Well>

            <TicketComment ticket={ticket}/>

            <TicketActions ticket={ticket}/>

            <TicketTimeline attachments={attachments}/>

        </PageContainer>
    )
}
