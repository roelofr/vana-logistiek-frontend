'use client';

import {useState} from 'react';
import {TicketType, Vendor} from "@/app/domain";
import TicketVendorStep from "@/app/ui/ticket-wizard/TicketVendorStep";
import TicketDetailsStep from "@/app/ui/ticket-wizard/TicketDetailsStep";
import TicketSummaryStep from "@/app/ui/ticket-wizard/TicketSummaryStep";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import {ApiResponse} from "@/app/stores/apiStore";

const steps = [
    {
        label: 'Standhouder',
        description: 'Geef de standhouder aan.',
    },
    {
        label: 'Details',
        description: `Geef de details op.`,
    },
    {
        label: 'Samenvatting',
        description: `Controleer en verzend.`,
    },
];

enum Steps {
    Vendor,
    Details,
    Summary
}

interface TicketWizardProps {
    vendors: Promise<ApiResponse<Vendor[]>>;
}

export default function TicketWizard({vendors}: TicketWizardProps) {
    const [step, setStep] = useState(0);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [data, setData] = useState<Record<string, unknown> & TicketDetails>({
        title: '',
        details: null
    });

    const type = TicketType.Generic;

    const setVendorAndContinue = (vendor: Vendor | null) => {
        setVendor(vendor)
        if (vendor)
            setStep(Steps.Details)
    }
    const setDetailsAndContinue = (details: TicketDetails) => {
        setData({
            ...data,
            ...details,
        })
        setStep(Steps.Summary)
    }

    const renderCorrectStep = () => {
        if (step == Steps.Vendor)
            return <TicketVendorStep vendors={vendors} vendor={vendor} setVendor={setVendorAndContinue}/>

        if (step == Steps.Details)
            return <TicketDetailsStep details={data} setDetails={setDetailsAndContinue}
                                      back={() => setStep(Steps.Vendor)}/>

        if (step >= Steps.Details)
            return <TicketSummaryStep vendor={vendor!} type={type!} data={data} back={() => setStep(Steps.Details)}/>
    }

    return (
        <Box>
            <Stepper activeStep={step}>
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            {renderCorrectStep()}
        </Box>
    );
}
