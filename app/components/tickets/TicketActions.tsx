'use client';

import * as React from 'react';
import {useCallback} from 'react';
import {Ticket, TicketStatus} from "@/app/domain";
import SetStatusAction from "@/app/actions/SetStatusAction";
import {redirect, RedirectType} from "next/navigation";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function TicketActions({ticket}: { ticket: Ticket }) {
    const [isLoading, setIsLoading] = React.useState(false);

    const setStatus = useCallback(async (status: TicketStatus) => {
        setIsLoading(true);

        try {
            await SetStatusAction(ticket, status);
        } catch (error) {
            setIsLoading(false);
            console.log('Status instellen mislukt: %s', error);
        } finally {
            redirect(`/tickets/${ticket.id}`, RedirectType.replace);
        }
    }, [setIsLoading, ticket]);

    return (
        <Stack direction="column" spacing={2} sx={{marginTop: '1rem'}}>
            <Typography variant="h5">
                Status veranderen
            </Typography>

            <Typography variant="body1">
                Speciaal voor de CP, kan je hier de status aanpassen. Alleen voor de CP :)
            </Typography>

            <Stack direction="row" spacing={2} sx={{width: '100%'}}>
                <Button variant="outlined" disabled={isLoading} onClick={() => setStatus(TicketStatus.Updated)}>Bijgewerkt</Button>
                <Button variant="outlined" disabled={isLoading} onClick={() => setStatus(TicketStatus.Assigned)}>Toegewezen</Button>
                <Button variant="outlined" disabled={isLoading} onClick={() => setStatus(TicketStatus.Resolved)}>Afgerond</Button>
            </Stack>
        </Stack>
    )
}
