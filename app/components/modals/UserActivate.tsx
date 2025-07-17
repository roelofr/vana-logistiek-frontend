import * as React from 'react';
import {Suspense} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {District, User} from "@/app/domain";
import PickerSkeleton from "@/app/ui/pickers/PickerSkeleton";
import DistrictPicker from "@/app/components/pickers/DistrictPicker";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";

interface UserActivateProps {
    open: boolean;
    user: null | User;
    onClose: (changed: boolean) => void;
}

const systemRoles = [
    ['role.user', 'Gebruiker'],
    ['role.cp', 'Centrale Post'],
    ['role.admin', 'Admin']
]

export default function UserActivate({open, user, onClose}: UserActivateProps) {
    const [openState, setOpenState] = React.useState(open);
    const [pickedDistrict, setPickedDistrict] = React.useState<District | null>(null);
    const [roles, setRoles] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (user == null && open)
            throw new Error("Tried to open modal without a user present")

        setOpenState(open)
    }, [user, open, setOpenState]);

    const handleClose = (success: boolean = false) => {
        setOpenState(false);
        setPickedDistrict(null);
        setRoles([]);
        onClose(success);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const email = formJson.email;
        console.log(email);
        handleClose(true);
    };

    const toggleRole = React.useCallback((role: string) => {
        console.log('Add item %o to %o', role, roles);
        if (roles.includes(role))
            setRoles(roles.filter(rolesRole => rolesRole !== role))
        else
            setRoles(Array.from(roles).concat(role))
    }, [roles, setRoles])

    return (
        <Dialog open={openState} onClose={() => handleClose(false)}>
            <DialogTitle>Gebruiker activeren</DialogTitle>
            <DialogContent sx={{paddingBottom: 0}}>
                <DialogContentText>
                    Kies een rol, en optioneel een wijk om de gebruiker <strong>{user?.name}</strong> te activeren.
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Suspense fallback={<PickerSkeleton/>}>
                        <DistrictPicker value={pickedDistrict} setValue={district => setPickedDistrict(district)}/>
                    </Suspense>

                    <FormGroup>
                        {systemRoles.map(([role, label]) => (
                            <FormControlLabel
                                key={role}
                                control={<Checkbox name="roles" value={role} checked={roles.includes(role)}
                                                   onChange={() => toggleRole(role)}/>} label={label}/>
                        ))}
                    </FormGroup>

                    <DialogActions>
                        <Button onClick={() => handleClose(false)}>Annuleren</Button>
                        <Button type="submit">Toepassen</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}
