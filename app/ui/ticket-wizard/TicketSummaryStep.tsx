'use client';

import Box from "@mui/material/Box";
import {TicketType, Vendor} from "@/app/domain";
import TicketWizardActionBar from "@/app/ui/ticket-wizard/TicketWizardActionBar";
import {Fragment} from "react";


interface SummaryProps {
    vendor: Vendor;
    type: TicketType;
    data: Record<string, unknown>;
    back: () => void;
    submit: () => void;
}

export default function TicketSummaryStep({vendor, type, data, back, submit}: SummaryProps) {
    return (
        <Box>
            <h1>Summary</h1>

            <dl>
                <dt>Vendor</dt>
                <dd>${vendor.name}</dd>

                <dt>Type</dt>
                <dd>${type}</dd>

                <dt>Data</dt>
                <dd>
                    <dl>
                        ${Object.entries(data).map(([key, value]) => (
                        <Fragment key={key}>
                            <dt>${key}</dt>
                            <dd>${value as string}</dd>
                        </Fragment>
                    ))}
                    </dl>
                </dd>
            </dl>

            <TicketWizardActionBar handleSubmit={submit} handleBack={back} lastStep={true}/>
        </Box>
    )
}
