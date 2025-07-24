"use server";

import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {Ticket, TicketAttachment} from "@/app/domain";
import Typography from "@mui/material/Typography";
import PageContainerWithToolbar from "@/app/components/PageContainerWithToolbar";
import TicketViewMenu from "@/app/ui/TicketViewMenu";
import TicketTimeline from "@/app/components/tickets/TicketTimeline";
import {EntityType} from "@/app/lib/resolver";

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
        <PageContainerWithToolbar title={`${ticket.description} #${ticket.id}`}
                                  toolbar={<TicketViewMenu ticket={ticket}/>}>
            <Typography variant="body1" gutterBottom>
                Hieronder staan de details van ticket {ticket.id}.
            </Typography>

            <Typography variant="body1" gutterBottom>
                {ticketDescription ?? <em>Geen omschrijving</em>}
            </Typography>

            <TicketTimeline attachments={attachments}/>
        </PageContainerWithToolbar>
    )
}
