'use server';

import {Ticket} from "@/app/domain";
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";

export default async function resolveTicket(ticket: Ticket, comment: string | null = null): Promise<void> {
    const api = new ApiStore(await auth())

    const resp = await api.post<void>(`/ticket/${ticket.id}/do/resolve`, {
        comment,
    })

    if (resp.ok) {
        return;
    }

    console.error('Failed to resolve ticket')
    throw new Error(`Failed to resolve ticket: ${resp.error}: ${resp.message}`)
}
