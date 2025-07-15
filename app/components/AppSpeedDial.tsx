'use client';

import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {useRouter} from "next/navigation";

declare interface ActionType {
    name: string;
    icon: React.ReactNode;
    href: string;
}

const actions: ActionType[] = [
    {
        icon: <AddIcon/>,
        name: 'Nieuw ticket',
        href: '/tickets/new'
    },
    {
        icon: <SearchIcon/>,
        name: 'Zoeken',
        href: '/search'
    },
];

export default function AppSpeedDial() {
    const router = useRouter()
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <SpeedDial
            ariaLabel="Snelle acties"
            sx={{position: 'absolute', bottom: 16, right: 16}}
            icon={<SpeedDialIcon/>}
            onOpen={handleOpen}
            onClose={handleClose}
            open={open}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    slotProps={{tooltip: {title: action.name}}}
                    onClick={() => {
                        handleClose();
                        router.push(action.href)
                    }}
                />
            ))}
        </SpeedDial>
    );
}
