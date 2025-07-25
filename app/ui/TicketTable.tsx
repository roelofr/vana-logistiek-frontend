import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Ticket} from "@/app/domain";
import VendorBadge from "@/app/components/badges/VendorBadge";
import StatusBadge from "@/app/components/badges/StatusBadge";
import Link from 'next/link'

interface TicketRowProps {
    ticket: Ticket;
}

function Row({ticket}: TicketRowProps) {
    const ticketLink = `/tickets/${ticket.id}`

    return (
        <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
            <TableCell component="th" scope="row">
                {ticket.id}
            </TableCell>
            <TableCell>
                <Link href={ticketLink}>
                    {ticket.description}
                </Link>
            </TableCell>
            <TableCell>
                <VendorBadge vendor={ticket.vendor!}/>
            </TableCell>
            <TableCell>
                <StatusBadge status={ticket.status}/>
            </TableCell>
        </TableRow>
    );
}

interface TicketTableArgs {
    tickets: Ticket[];
}

export default function TicketTable({tickets}: TicketTableArgs) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="Tabel met tickets">
                <TableHead>
                    <TableRow>
                        <TableCell>Nr</TableCell>
                        <TableCell>Omschrijving</TableCell>
                        <TableCell>Standhouder</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tickets.map((ticket) => (
                        <Row key={ticket.id} ticket={ticket}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
