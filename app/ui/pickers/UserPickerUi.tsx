'use client'

import * as React from 'react';
import {useCallback, useEffect} from 'react';
import {User} from "@/app/domain";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import resolveRelation, {RelationType} from "@/app/lib/resolver";
import MenuItem from "@mui/material/MenuItem";
import {UserPickerProps} from "@/app/components/pickers/UserPicker";

function UserMenuItem({user}: { user: User }) {
    const district = resolveRelation(RelationType.District, user.district ?? null);

    if (district)
        return <MenuItem value={user.id}>{user.name} ({district.name})</MenuItem>

    return <MenuItem value={user.id}>{user.name}</MenuItem>
}

interface UserPickerUiProps extends UserPickerProps {
    users: Promise<User[]>;
}

export default function UserPickerUi({users, value, onChange}: UserPickerUiProps) {
    const userList = React.use(users)
    const [valueState, setValueState] = React.useState<string | number>('');

    useEffect(() => {
        if (!value)
            setValueState('');
        else if (typeof value == 'object')
            setValueState(String((value as User).id))
        else
            setValueState(value);
    }, [value]);

    const handleChange = useCallback((newValue: string | number | null) => {
        setValueState(newValue ?? '');

        console.log("Set value stat to {}", newValue);

        if (!newValue)
            return onChange(null);

        const userId = typeof newValue == 'number' ? newValue : Number.parseInt(newValue, 10);
        onChange(userId)
    }, [setValueState, onChange]);

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl variant="filled" fullWidth>
                <InputLabel id="user-select-label">Gebruiker</InputLabel>
                <Select
                    labelId="user-select-label"
                    id="user-select"
                    value={valueState ?? ''}
                    label="Gebruiker"
                    onChange={e => {
                        console.log('Change %o', e);
                        handleChange(e.target.value)
                    }}
                >
                    {userList.map((user) => <UserMenuItem key={user.id} user={user}/>)}
                </Select>
            </FormControl>
        </Box>
    );
}
