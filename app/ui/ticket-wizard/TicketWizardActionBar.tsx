'use client';

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface ActionBarProps {
    handleBack?: () => void;
    handleSubmit: () => void;
    firstStep?: boolean;
    lastStep?: boolean;
}

export default function TicketWizardActionBar({
                                                  handleBack,
                                                  handleSubmit,
                                                  firstStep = false,
                                                  lastStep = false
                                              }: ActionBarProps) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
            <Button
                color="inherit"
                disabled={firstStep}
                onClick={handleBack}
                sx={{mr: 1}}
            >
                Back
            </Button>

            <Box sx={{flex: '1 1 auto'}}/>
            <Button onClick={handleSubmit}>
                {lastStep ? 'Afronden' : 'Volgende'}
            </Button>
        </Box>
    )
}
