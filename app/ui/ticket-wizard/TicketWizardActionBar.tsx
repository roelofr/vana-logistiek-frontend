'use client';

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface ActionBarProps {
    onBack?: () => void;
    onSubmit?: () => void;
    firstStep?: boolean;
    lastStep?: boolean;
}

export default function TicketWizardActionBar({
                                                  onBack,
                                                  onSubmit,
                                                  firstStep = false,
                                                  lastStep = false
                                              }: ActionBarProps) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
            <Button
                variant="outlined"
                disabled={firstStep}
                onClick={onBack}
                sx={{mr: 1}}
            >
                Vorige
            </Button>

            <Box sx={{flex: '1 1 auto'}}/>

            <Button
                variant="outlined"
                onClick={onSubmit}
                type={onSubmit ? 'button' : 'submit'}
            >
                {lastStep ? 'Afronden' : 'Volgende'}
            </Button>
        </Box>
    )
}
