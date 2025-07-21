import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {User} from "@/app/domain";
import {TextField} from "@mui/material";
import UserSetNameAction from "@/app/components/modals/UserSetNameAction";
import Box from "@mui/material/Box";

interface UserSetNameProps {
    open: boolean;
    user: null | User;
    onClose: (changed: boolean) => void;
}

export default function UserSetName({open, user, onClose}: UserSetNameProps) {
    const [openState, setOpenState] = React.useState(open);
    const [name, setName] = React.useState<string>('');

    React.useEffect(() => {
        if (user == null && open)
            throw new Error("Tried to open modal without a user present")

        if (user)
            setName(user.name)

        setOpenState(open)
    }, [user, open, setOpenState]);

    const handleClose = (success: boolean = false) => {
        setOpenState(false);
        onClose(success);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());

        console.log('Form data = %o', formJson);

        UserSetNameAction(user!, name);

        handleClose(true);
    };

    return (
        <Dialog open={openState} onClose={() => handleClose(false)}>
            <DialogTitle>Naam instellen</DialogTitle>
            <DialogContent sx={{paddingBottom: 0}}>
                <DialogContentText>
                    Typ hieronder de nieuwe naam van de gebruiker in.
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <TextField required margin="normal" name="name" label="Naam" variant="outlined"
                                   value={name}
                                   onChange={e => setName(e.target.value)}
                                   slotProps={{htmlInput: {'autocomplete': 'off'}}}/>

                        <TextField disabled margin="normal" label="E-mailadres" variant="outlined" value={user?.email}/>

                        <DialogActions>
                            <Button onClick={() => handleClose(false)}>Annuleren</Button>
                            <Button type="submit">Toepassen</Button>
                        </DialogActions>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}
