import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const actions = [
    {icon: <AddIcon/>, name: 'Nieuw ticket'},
    {icon: <SearchIcon/>, name: 'Zoeken'},
];

export default function AppSpeedDial() {
    return (
        <SpeedDial
            ariaLabel="Snelle acties"
            sx={{position: 'absolute', bottom: 16, right: 16}}
            icon={<SpeedDialIcon/>}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                />
            ))}
        </SpeedDial>
    );
}
