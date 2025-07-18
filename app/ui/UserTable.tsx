'use client';

import * as React from 'react';
import {use, useCallback, useEffect, useState} from 'react';
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

interface UserRowProps {
    user: User;
    activateUser: () => void;
    deactivateUser: () => void;
}

function Row({user, activateUser, deactivateUser}: UserRowProps) {
    const userRoles = (user.roles ?? []).map(row => row.replace(/^role\./, ''));

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
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
                        <MenuItem disabled={user.active} onClick={() => {
                            activateUser();
                            handleClose()
                        }}>Configureren</MenuItem>

                        <MenuItem disabled={!user.active} onClick={() => {
                            deactivateUser();
                            handleClose();
                        }}>My account</MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
        </React.Fragment>
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
    const [activateOpen, setActivateOpen] = useState(false);
    const [deactivateOpen, setDeactivateOpen] = useState(false);
    const [actionUser, setActionUser] = useState<User | null>(null);

    const doActivateUser = useCallback((user: User) => {
        setActionUser(user);
        setActivateOpen(true);
    }, [setActionUser, setActivateOpen]);

    const doActivateClose = useCallback((applied: boolean) => {
        setActivateOpen(false);
        if (applied)
            router.refresh();
    }, [setActivateOpen, router]);

    const doDeativateUser = useCallback((user: User) => {
        setActionUser(user);
        setDeactivateOpen(true);
    }, [setActionUser, setDeactivateOpen]);

    useEffect(() => {
        if (deactivateOpen)
            console.log('deactivateOpen is open')
    }, [deactivateOpen]);

    return (
        <React.Fragment>
            <UserActivate onClose={doActivateClose} user={actionUser} open={activateOpen}/>

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
