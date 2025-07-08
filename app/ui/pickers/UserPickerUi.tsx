'use client'

import * as React from 'react';
import {User} from "@/app/domain";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ApiResponse} from "@/app/stores/apiStore";

export default function UserPickerUi({users}: { users: Promise<ApiResponse<User[]>> }) {
    const response = React.use(users)
    const allUsers = response.ok ? response.data : [];
    const [user, setUser] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setUser(event.target.value as string);
    };

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="user-select-label">Gebruiker</InputLabel>
                <Select
                    labelId="user-select-label"
                    id="user-select"
                    value={user}
                    label="Gebruiker"
                    onChange={handleChange}
                >
                    {allUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
