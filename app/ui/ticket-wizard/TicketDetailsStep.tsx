'use client';

import TicketWizardActionBar from "@/app/ui/ticket-wizard/TicketWizardActionBar";
import * as React from "react";
import {TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";


interface TypeStepProps {
    details: TicketDetails;
    setDetails: (details: TicketDetails) => void;
    back: () => void;
}

export default function TicketDetailsStep({details, setDetails, back}: TypeStepProps) {
    const [title, setTitle] = React.useState(details.title ?? '')
    const [description, setDescription] = React.useState(details.details ?? '')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data = {
            title: formData.get('title') ?? '',
            details: formData.get('description') ?? null,
        }

        if (typeof data.title != 'string' || data.title.trim() == '')
            return;

        setDetails(data as TicketDetails);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h2">Hier klagen a.u.b.</Typography>

                <TextField margin="normal"
                           name="title"
                           variant="filled"
                           label="Samenvatting"
                           helperText="Bijvoorbeeld: Bijbestelling, Gatorteam, TNT, etc..."
                           value={title}
                           onChange={e => setTitle(e.target.value)}
                           required/>

                <TextField margin="normal"
                           name="description"
                           label="Omschrijving"
                           variant="filled"
                           helperText="Bijvoorbeeld: 5x Tyfec polsbandjes, 1x parkeerpas"
                           value={description}
                           onChange={e => setDescription(e.target.value)}
                           minRows={4}
                           multiline
                           fullWidth
                />

                <TicketWizardActionBar onBack={back}/>
            </Stack>
        </form>
    )
}
