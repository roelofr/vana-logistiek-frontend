'use server';

import {Ticket} from "@/app/domain";
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";

export default async function CreateTicketCommentAction(ticket: Ticket, comment: string): Promise<void> {
    const api = new ApiStore(await auth())

    console.log("Adding comment to ticket #%d with body %s", ticket.id, comment);

    const resp = await api.post<void>(`/ticket/${ticket.id}/do/comment`, {
        comment,
    })

    if (resp.ok) {
        return;
    }

    console.error('Failed to add comment to ticket')
    throw new Error(`Failed to add comment to tickets: ${resp.error}: ${resp.message}`)
}
