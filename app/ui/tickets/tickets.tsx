'use client'
import {use} from 'react'
import {Ticket} from "@/app/domain";
import {ApiResponse} from "@/app/stores/apiStore";
import TicketTable from "@/app/ui/TicketTable";

type TicketArgs = {
    tickets: Promise<ApiResponse<Ticket[]>>
}

export default function Tickets({tickets}: TicketArgs) {
    const allTickets = use(tickets)

    if (allTickets.ok)
        return <TicketTable tickets={allTickets.data} />

    return (
        <p>Failed to load tickets!</p>
    )
}
