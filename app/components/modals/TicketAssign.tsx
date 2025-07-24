import * as React from 'react';
import {useMemo} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Ticket, User} from "@/app/domain";
import Box from "@mui/material/Box";
import TicketAssignAction from "@/app/components/modals/TicketAssignAction";
import UserPickerUi from "@/app/ui/pickers/UserPickerUi";

interface TicketAssignProps {
    open: boolean;
    users: User[];
    ticket: null | Ticket;
    onClose: (changed: boolean) => void;
}

export default function TicketAssign({users, open, ticket, onClose}: TicketAssignProps) {
    const [openState, setOpenState] = React.useState(open);
    const [userId, setUserId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (ticket == null && open)
            throw new Error("Tried to open modal without a ticket present")

        if (ticket)
            setUserId(ticket.assignee?.id ?? null)

        setOpenState(open)
    }, [ticket, open, setOpenState]);

    const handleClose = (success: boolean = false) => {
        setOpenState(false);
        onClose(success);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        TicketAssignAction(ticket!, userId);

        handleClose(true);
    };

    const usersAsPromise = useMemo(() => Promise.resolve(users), [users]);

    return (
        <Dialog open={openState} onClose={() => handleClose(false)}>
            <DialogTitle>Ticket ${ticket?.id ?? ''} Toewijzen</DialogTitle>
            <DialogContent sx={{paddingBottom: 0}}>
                <DialogContentText>
                    Kies hieronder welke gebruiker je wil toewijzen aan dit ticket.
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <UserPickerUi users={usersAsPromise} value={userId} onChange={value => setUserId(value)}/>

                        <DialogActions>
                            <Button onClick={() => handleClose(false)}>Annuleren</Button>
                            <Button type="submit">Toewijzen</Button>
                        </DialogActions>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}
