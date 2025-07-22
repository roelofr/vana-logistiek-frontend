'use client';

import {TicketType, Vendor} from "@/app/domain";
import TicketWizardActionBar from "@/app/ui/ticket-wizard/TicketWizardActionBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


interface SummaryProps {
    vendor: Vendor;
    type: TicketType;
    data: Record<string, unknown> & TicketDetails;
    back: () => void;
    submit: () => void;
}

export default function TicketSummaryStep({vendor, type, data, back, submit}: SummaryProps) {
    const description = data.details ?? '–';
    return (
        <Box>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <Typography variant="h2">Dit ga je aanmaken...</Typography>
                </Grid>
                <Grid size={4}>
                    Standhouder
                </Grid>
                <Grid size={8}>
                    {vendor.number} - {vendor.name}
                </Grid>

                <Grid size={4}>
                    Type
                </Grid>
                <Grid size={8}>
                    {type}
                </Grid>

                <Grid size={4}>
                    Titel
                </Grid>
                <Grid size={8}>
                    {data.title as string}
                </Grid>

                <Grid size={4}>
                    Omschrijving
                </Grid>
                <Grid size={8}>
                    {description}
                </Grid>
            </Grid>

            <TicketWizardActionBar onSubmit={submit} onBack={back} lastStep={true}/>
        </Box>
    )
}
