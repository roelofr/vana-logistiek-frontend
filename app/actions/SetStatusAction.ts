'use server';

import {Ticket, TicketStatus} from "@/app/domain";
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";

export default async function SetStatusAction(ticket: Ticket, status: TicketStatus): Promise<void> {
    if (status == TicketStatus.Created)
        return;

    const api = new ApiStore(await auth())

    console.log("Setting state of ticket %d to %s", ticket.id, status);

    const resp = await api.post<void>(`/ticket/${ticket.id}/do/status`, {
        status,
    })

    if (resp.ok)
        return;

    console.error('Failed to change status of ticket')
    console.log('Response is %o', resp);
    throw new Error(`Failed to change status of ticket: ${resp.error}: ${resp.message}`)
}
