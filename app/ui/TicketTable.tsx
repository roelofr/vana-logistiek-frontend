import * as React from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Ticket, Vendor} from "@/app/domain";
import VendorBadge from "@/app/components/badges/VendorBadge";
import StatusBadge from "@/app/components/badges/StatusBadge";
import Link from 'next/link'

interface TicketRowProps {
    ticket: Ticket;
}

const tableColums: GridColDef[] = [
    {field: 'id', headerName: 'Nr', minWidth: 50, maxWidth: 150},
    {field: 'description', headerName: 'Omschrijving', minWidth: 300, maxWidth: 400},
    {
        field: 'vendor',
        headerName: 'Standhouder',
        minWidth: 200,
        sortComparator: (v1, v2) => (v1 as Vendor).numberNumeric - (v2 as Vendor).numberNumeric,
        renderCell: params => <VendorBadge vendor={params.value}/>
    },
    {
        sortable: false,
        filterable: true,
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: params => <StatusBadge status={params.value}/>
    },
];


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
        <Paper style={{width: '100%'}}>
            <DataGrid rows={tickets} columns={tableColums} disableColumnSelector={true}/>
        </Paper>
    );
}
