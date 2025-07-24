'use server';

import {Ticket} from "@/app/domain";
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";

export default async function AssignTicket(ticket: Ticket, userId: number, comment: string | null = null): Promise<void> {
    const api = new ApiStore(await auth())

    console.log("Assigning ticket #%d to user %d using a comment? %s", ticket.id, userId, Boolean(comment));

    const resp = await api.post<void>(`/ticket/${ticket.id}/do/assign`, {
        userId,
        comment,
    })

    if (resp.ok) {
        return;
    }

    console.error('Failed to assign ticket')
    throw new Error(`Failed to assign ticket: ${resp.error}: ${resp.message}`)
}
