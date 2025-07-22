'use server';

import {Ticket, TicketType} from "@/app/domain";
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";

export default async function CreateTicket(type: TicketType, vendorId: number, description: string, details: Record<string, unknown>) {
    const api = new ApiStore(await auth())

    const resp = await api.post<Ticket>('/ticket', {
        type,
        vendorId,
        description,
        data: details,
    })

    if (!resp.ok) {
        console.error('Failed to create ticket')
        throw new Error(`Failed to create ticket: ${resp.error}: ${resp.message}`)
    }

    const ticket = resp.data;
    console.log("Created ticket %o: %s", ticket.id, ticket.description)

    return ticket;
}
