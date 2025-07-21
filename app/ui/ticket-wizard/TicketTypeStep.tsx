'use client';

import Box from "@mui/material/Box";
import {TicketType, TicketTypeDetails} from "@/app/domain";
import TicketWizardActionBar from "@/app/ui/ticket-wizard/TicketWizardActionBar";
import * as React from "react";
import {createElement, useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {TextField} from "@mui/material";


interface TypeStepProps {
    type: TicketType;
    setType: (type: TicketType) => void;
    back: () => void;
}

export default function TicketTypeStep({type, setType, back}: TypeStepProps) {
    const [localType, setLocalType] = useState<TicketType>(type ?? TicketType.Generic);

    const submit = () => {
        if (!localType)
            return;

        setType(localType);
    }

    const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
        setLocalType(nextView as TicketType);
    };

    return (
        <Box>
            <h1>Wat is het probleem?</h1>

            <ToggleButtonGroup
                orientation="vertical"
                value={localType}
                exclusive
                onChange={handleChange}
            >
                {TicketTypeDetails.values().map(detail => (
                    <ToggleButton value={detail.type} key={detail.type}>
                        {createElement(detail.icon)}
                        {detail.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            <TextField margin="normal" name="description" variant="outlined" label="Omschrijving"
                       required/>

            <TicketWizardActionBar onSubmit={submit} onBack={back}/>
        </Box>
    )
}
