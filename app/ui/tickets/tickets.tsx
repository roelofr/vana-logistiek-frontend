'use client'
import {use} from 'react'
import {Ticket} from "@/app/domain";

type TicketArgs = {
    tickets: Promise<Ticket[]>
}

export default function Tickets({tickets}: TicketArgs) {
    const allTickets = use(tickets)

    return (
        <ul>
            {allTickets.map((post) => (
                <li key={post.id}>{post.description}</li>
            ))}
        </ul>
    )
}
