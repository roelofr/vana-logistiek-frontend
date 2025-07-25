'use client';

import {Ticket} from "@/app/domain";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from "react";
import {FormEvent, useCallback} from "react";
import {redirect, RedirectType} from "next/navigation";
import CreateTicketCommentAction from "@/app/actions/CreateTicketCommentAction";
import Stack from "@mui/material/Stack";

export default function TicketComment({ticket}: { ticket: Ticket }) {
    const [isLoading, setIsLoading] = React.useState(false);

    const addComment = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.target as HTMLFormElement);

        const comment = (data.get('comment') ?? '') as string;
        if (!comment)
            return;

        setIsLoading(true);

        try {
            await CreateTicketCommentAction(ticket, comment);
        } catch (error) {
            setIsLoading(false);
            console.log('Status instellen mislukt: %s', error);
        } finally {
            redirect(`/tickets/${ticket.id}`, RedirectType.replace);
        }
    }, [setIsLoading, ticket]);

    return (
        <Stack component="form" onSubmit={addComment} direction="column" spacing={2} sx={{marginTop: '1rem'}}>
            <Typography variant="h5">
                Opmerking toevoegen
            </Typography>
            <TextField
                name="comment"
                id="ticket-comment"
                label="Opmerking"
                placeholder="De standhouder is nog steeds niet tevreden, en wil meer! Meer! MEEERRRR!"
                minRows={4}
                multiline
                fullWidth
                variant="filled"
            />

            <Stack direction="row" spacing={2}>
                <Button
                    disabled={isLoading}
                    type="submit"
                    variant="outlined">Opmerking toevoegen</Button>
            </Stack>
        </Stack>
    );
}
