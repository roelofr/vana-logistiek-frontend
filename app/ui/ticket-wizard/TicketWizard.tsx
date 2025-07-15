'use client';

import * as React from 'react';
import {TicketType, Vendor} from "@/app/domain";
import TicketVendorStep from "@/app/ui/ticket-wizard/TicketVendorStep";
import TicketTypeStep from "@/app/ui/ticket-wizard/TicketTypeStep";
import TicketSummaryStep from "@/app/ui/ticket-wizard/TicketSummaryStep";
import TicketGenericDataStep from "@/app/ui/ticket-wizard/TicketGenericDataStep";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = [
    {
        label: 'Type',
        description: 'Geef het type op van het ticket.',
    },
    {
        label: 'Standhouder',
        description: `Selecteer de standhouder.`,
    },
    {
        label: 'Details',
        description: `Geef de details op.`,
    },
];

enum Steps {
    Vendor,
    Type,
    Details,
    Summary
}

export default function TicketWizard() {
    const [step, setStep] = React.useState(0);
    const [vendor, setVendor] = React.useState<Vendor | null>(null);
    const [type, setType] = React.useState<TicketType>(TicketType.Generic);
    const [data, setData] = React.useState<Record<string, unknown>>({});

    const setVendorAndContinue = (vendor: Vendor) => {
        setVendor(vendor)
        setStep(Steps.Vendor)
    }
    const setTypeAndContinue = (type: TicketType) => {
        setType(type)
        setStep(Steps.Details)
    }

    const setDataAndContinue = (data: Record<string, unknown>) => {
        setData(data)
        setStep(Steps.Summary)
    }

    const renderCorrectStep = () => {
        if (step == Steps.Vendor)
            return <TicketVendorStep vendor={vendor} setVendor={setVendorAndContinue}/>

        if (step == Steps.Type)
            return <TicketTypeStep type={type} setType={setTypeAndContinue} back={() => setStep(1)}/>

        if (step >= Steps.Summary)
            return <TicketSummaryStep vendor={vendor!} type={type!} data={data} back={() => setStep(2)}
                                      submit={() => alert('ok')}/>

        switch (type) {
            case TicketType.Generic:
                return <TicketGenericDataStep data={data}
                                              setData={setDataAndContinue}
                                              back={() => setStep(2)}/>
            default:
                return <h1>Fuck!</h1>
        }
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

            ${renderCorrectStep()}
        </Box>
    );
}
