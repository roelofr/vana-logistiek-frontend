import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Ticket, TicketStatus} from "@/app/domain";
import VendorBadge from "@/app/components/badges/VendorBadge";
import StatusBadge from "@/app/components/badges/StatusBadge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import resolveTicket from "@/app/actions/resolveTicket";
import Link from 'next/link'

interface TicketRowProps {
    ticket: Ticket;
}

function isResolved(ticket: Ticket) {
    switch (ticket.ticketType) {
        case TicketStatus.Resolved:
        case TicketStatus.Completed:
            return true;

        default:
            return false;
    }
}

function Row({ticket}: TicketRowProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
            <TableCell>

                <IconButton
                    aria-label="opties"
                    id="long-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                >
                    <MenuItem disabled={isResolved(ticket)} onClick={() => {
                        resolveTicket(ticket);
                        handleClose()
                    }}>Ticket sluiten</MenuItem>
                </Menu>
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
                        <TableCell aria-label="Acties"/>
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
