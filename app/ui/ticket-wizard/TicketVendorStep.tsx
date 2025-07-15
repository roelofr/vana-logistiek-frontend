'use client';

import Box from "@mui/material/Box";
import {Vendor} from "@/app/domain";
import TicketWizardActionBar from "@/app/ui/ticket-wizard/TicketWizardActionBar";
import * as React from "react";
import {useState} from "react";
import VendorPicker from "@/app/components/pickers/VendorPicker";

interface VendorStepProps {
    vendor: Vendor | null;
    setVendor: (vendor: Vendor) => void;
}

export default function TicketVendorStep({vendor, setVendor}: VendorStepProps) {
    const [value] = useState<Vendor | null>(vendor ?? null);

    const submit = () => {
        if (!value)
            return;

        setVendor(value);
    }

    return (
        <Box>
            <h1>Set vendor</h1>

            <VendorPicker/>

            <TicketWizardActionBar handleSubmit={submit} firstStep={true}/>
        </Box>
    )
}
