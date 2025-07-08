'use client'
import {use} from 'react'
import {Ticket} from "@/app/domain";
import {ApiResponse} from "@/app/stores/apiStore";

type TicketArgs = {
    tickets: Promise<ApiResponse<Ticket[]>>
}

export default function Tickets({tickets}: TicketArgs) {
    const allTickets = use(tickets)

    if (allTickets.ok)
        return (
            <ul>
                {allTickets.data.map((post) => (
                    <li key={post.id}>{post.description}</li>
                ))}
            </ul>
        )

    return (
        <p>Failed to load tickets!</p>
    )
}
