'use server';

import {Ticket, TicketType} from "@/app/domain";
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";

export default async function createTicket(type: TicketType, vendorId: number, description: string) {
    const api = new ApiStore(await auth())

    const ticket = await api.post<Ticket>('/ticket', {
        type,
        vendorId,
        description
    })

    console.log("Created ticket %o: %s", ticket.id, ticket.description)

    return ticket;
}
