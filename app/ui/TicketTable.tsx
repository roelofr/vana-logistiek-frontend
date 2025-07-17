import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Ticket} from "@/app/domain";
import VendorBadge from "@/app/components/badges/VendorBadge";
import StatusBadge from "@/app/components/badges/StatusBadge";
import UserBadge from "@/app/components/badges/UserBadge";

function Row(props: { ticket: Ticket }) {
    const {ticket} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {ticket.id}
                </TableCell>
                <TableCell>
                    {ticket.description}
                </TableCell>
                <TableCell>
                    <VendorBadge vendor={ticket.vendor!}/>
                </TableCell>
                <TableCell>
                    <StatusBadge status={ticket.status}/>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Samenvatting
                            </Typography>
                            <p>
                                This is still todo.
                            </p>

                            <p>
                                Created by
                                <UserBadge user={ticket.creator!}/>
                            </p>

                            <p>
                                Assigned to
                                {ticket.assignee ? <UserBadge user={ticket.assignee}/> : "Nobody"}
                            </p>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
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
                        <TableCell>&nbsp;</TableCell>
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
