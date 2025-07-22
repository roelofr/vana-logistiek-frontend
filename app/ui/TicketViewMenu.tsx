'use client';

import React from 'react';
import Button from "@mui/material/Button";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {fireConfetti} from "@/app/lib/confetti";

interface TicketViewMenuProps {
    id: number;
}

export default function TicketViewMenu({id}: TicketViewMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleActionClose = () => {
        handleClose();
        fireConfetti(50)
    }

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
                <MenuItem disabled>Ticket #{id}</MenuItem>
                <MenuItem onClick={handleActionClose}>Toewijzen</MenuItem>
                <MenuItem onClick={handleActionClose}>Afronden</MenuItem>
                <MenuItem onClick={handleActionClose}>Sluiten (alleen CP)</MenuItem>
            </Menu>
        </React.Fragment>
    )
}
