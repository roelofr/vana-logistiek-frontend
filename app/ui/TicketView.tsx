import {ApiResponse} from "@/app/stores/apiStore";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {Ticket} from "@/app/domain";
import {use} from 'react';

interface TicketViewProps {
    ticket: Promise<ApiResponse<Ticket>>;
}

export default function TicketView({ticket}: TicketViewProps) {
    const ticketResponse = use(ticket);

    if (!ticketResponse.ok)
        return null;

    const ticketObj = ticketResponse.data as Ticket;

    return (
        <Box>
            <Typography variant="h2">{ticketObj.description}</Typography>

            <Typography variant="body1">{"bla ".repeat(1000).trim()}</Typography>
        </Box>
    )
}
