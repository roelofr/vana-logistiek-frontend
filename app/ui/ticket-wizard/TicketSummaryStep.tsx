'use client';

import {useCallback, useState} from 'react';
import {TicketType, Vendor} from "@/app/domain";
import TicketWizardActionBar from "@/app/ui/ticket-wizard/TicketWizardActionBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreateTicket from "@/app/actions/CreateTicket";
import CircularProgress from '@mui/material/CircularProgress';
import {useRouter} from "next/navigation";
import {fireConfetti} from "@/app/lib/confetti";


interface SummaryProps {
    vendor: Vendor;
    type: TicketType;
    data: Record<string, unknown> & TicketDetails;
    back: () => void;
}

function LoadingBox() {
    return (
        <Box sx={{display: 'flex', alignItems: 'end'}}>
            <CircularProgress/>
        </Box>
    )
}

export default function TicketSummaryStep({vendor, type, data, back}: SummaryProps) {
    const description = data.details ?? '–';
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const submit = useCallback(async () => {
        setIsLoading(true);

        try {
            const ticket = await CreateTicket(type, vendor.id, data.title, data)

            fireConfetti(950);

            await router.push(`/tickets/${ticket.id}`);
        } catch (error) {
            console.error("Ticket creation error is %o", error);
            alert("Ticket aanmaken mislukt!");
        } finally {
            setIsLoading(false);
        }
    }, [vendor, type, data, router, setIsLoading]);

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

            {isLoading ? <LoadingBox/> : <TicketWizardActionBar onSubmit={submit} onBack={back} lastStep={true}/>}
        </Box>
    )
}
