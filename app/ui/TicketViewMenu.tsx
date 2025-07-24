'use client';

import React, {useCallback} from 'react';
import Button from "@mui/material/Button";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {fireConfetti} from "@/app/lib/confetti";
import {Ticket, User} from "@/app/domain";
import TicketAssign from "@/app/components/modals/TicketAssign";

enum OpenModal {
    None,
    Assign,
    Resolve,
    Close
}

interface TicketViewMenuProps {
    ticket: Ticket;
    users: User[];
}

export default function TicketViewMenu({users, ticket}: TicketViewMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = React.useState<OpenModal>(OpenModal.None);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleActionClose = useCallback((modal: OpenModal | undefined) => {
        handleClose();
        if (modal)
            setOpenModal(modal)
        else
            fireConfetti(50)
    }, [setOpenModal])

    const handleMenuClose = useCallback((succesful: boolean) => {
        setOpenModal(OpenModal.None)
        if (succesful)
            fireConfetti(300);
    }, [setOpenModal]);

    if (!ticket)
        return null;

    return (
        <React.Fragment>
            <Button
                id="ticket-menu-button"
                aria-controls={open ? 'ticket-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="outlined"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon/>}
            >
                Acties
            </Button>
            <Menu
                id="ticket-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'ticket-menu-button',
                    },
                }}
            >
                <MenuItem disabled>Ticket #{ticket.id}</MenuItem>
                <MenuItem onClick={() => handleActionClose(OpenModal.Assign)}>Toewijzen</MenuItem>
                <MenuItem onClick={() => handleActionClose(undefined)}>Afronden</MenuItem>
                <MenuItem onClick={() => handleActionClose(undefined)}>Sluiten (alleen CP)</MenuItem>
            </Menu>

            <TicketAssign users={users} open={openModal == OpenModal.Assign} ticket={ticket}
                          onClose={changed => handleMenuClose(changed)}/>
        </React.Fragment>
    )
}
