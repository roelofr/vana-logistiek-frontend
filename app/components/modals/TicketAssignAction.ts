'use server';

import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {Ticket} from "@/app/domain";

export default async function TicketAssignAction(ticket: Ticket, userId: number | null) {
    const session = await auth()

    if (!session)
        throw new Error('Failed to load session');

    const api = new ApiStore(session);

    return await api.post(`/ticket/${ticket.id}/do/assign`, {userId});
}
