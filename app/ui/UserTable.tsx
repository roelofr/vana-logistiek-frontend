'use client';

import * as React from 'react';
import {use, useCallback, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {User} from "@/app/domain";
import Chip from "@mui/material/Chip";
import {ApiResponse} from "@/app/stores/apiStore";
import DistrictBadge from "@/app/components/badges/DistrictBadge";
import Box from "@mui/material/Box";
import {Alert} from "@mui/material";
import Stack from "@mui/material/Stack";
import UserActivate from "@/app/components/modals/UserActivate";
import {useRouter} from "next/navigation";
import UserSetName from "@/app/components/modals/UserSetName";

interface UserRowProps {
    user: User;
    setUserName: () => void;
    activateUser: () => void;
    deactivateUser: () => void;
}

function Row({user, setUserName, activateUser, deactivateUser}: UserRowProps) {
    const userRoles = (user.roles ?? []).map(row => row.replace(/^role\./, ''));

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const userIsActive = user.active && (user.roles ?? []).length > 0

    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {user.name}
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={1}>
                    {userRoles.map(role => <Chip key={role} label={role}/>)}
                </Stack>
            </TableCell>
            <TableCell>
                {user.district ? <DistrictBadge district={user.district}/> : <small><em>Niet ingesteld</em></small>}
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
                    <MenuItem onClick={() => {
                        activateUser();
                        handleClose()
                    }}>Configureren</MenuItem>

                    <MenuItem onClick={() => {
                        setUserName();
                        handleClose()
                    }}>Naam wijzigen</MenuItem>

                    <MenuItem disabled={true} onClick={() => {
                        deactivateUser();
                        handleClose()
                    }}>Uitschakelen</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
}

function RenderError({error}: { error: number }) {
    return (
        <TableBody>
            <Box sx={{margin: '1rem'}}>
                <Alert variant="outlined" severity="warning">
                    Ophalen van de gebruikers is mislukt. Foutcode {error}
                </Alert>
            </Box>
        </TableBody>
    )
}

interface UserTableArgs {
    users: Promise<ApiResponse<User[]>>;
}

export default function UserTable({users}: UserTableArgs) {
    const router = useRouter();
    const data = use(users);
    const [currentOpen, setCurrentOpen] = useState<string | null>(null);
    const [actionUser, setActionUser] = useState<User | null>(null);

    const doActivateUser = useCallback((user: User) => {
        setActionUser(user);
        setCurrentOpen('activate');
    }, [setActionUser, setCurrentOpen]);

    const doDeativateUser = useCallback((user: User) => {
        setActionUser(user);
        setCurrentOpen('deactivate');
    }, [setActionUser, setCurrentOpen]);

    const doSetUserName = useCallback((user: User) => {
        setActionUser(user);
        setCurrentOpen('name');
    }, [setActionUser, setCurrentOpen]);

    const doActionClose = useCallback((applied: boolean) => {
        setCurrentOpen(null);
        if (applied)
            router.refresh();
    }, [setCurrentOpen, router]);


    return (
        <React.Fragment>
            <UserActivate onClose={doActionClose} user={actionUser} open={currentOpen == 'activate'}/>
            <UserSetName onClose={doActionClose} user={actionUser} open={currentOpen == 'name'}/>

            <TableContainer component={Paper}>
                <Table aria-label="Tabel met gebruikers">
                    <TableHead>
                        <TableRow>
                            <TableCell>Naam</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Wijk</TableCell>
                        </TableRow>
                    </TableHead>
                    {data.ok ? (
                        <TableBody>
                            {data.data.map((user) => (
                                <Row
                                    key={user.id}
                                    user={user}
                                    setUserName={() => doSetUserName(user)}
                                    activateUser={() => doActivateUser(user)}
                                    deactivateUser={() => doDeativateUser(user)}
                                />
                            ))}
                        </TableBody>
                    ) : <RenderError error={data.error}/>}
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}
