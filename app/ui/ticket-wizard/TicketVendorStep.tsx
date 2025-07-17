'use client';

import Box from "@mui/material/Box";
import {Vendor} from "@/app/domain";
import TicketWizardActionBar from "@/app/ui/ticket-wizard/TicketWizardActionBar";
import {Suspense, useCallback, useState} from "react";
import {ApiResponse} from "@/app/stores/apiStore";
import PickerSkeleton from "@/app/ui/pickers/PickerSkeleton";
import {VendorPickerUi} from "@/app/ui/pickers/VendorPickerUi";

interface VendorStepProps {
    vendors: Promise<ApiResponse<Vendor[]>>;
    vendor: Vendor | null;
    setVendor: (vendor: Vendor | null) => void;
}

export default function TicketVendorStep({vendors, vendor, setVendor}: VendorStepProps) {
    const [value, setValue] = useState<Vendor | null>(vendor ?? null);

    const doSetValue = useCallback((newValue: Vendor | null) => {
        console.log('Issued valeu %o', newValue);
        setValue(newValue)
    }, [setValue]);

    const submit = useCallback(() => value && setVendor(value), [setVendor, value]);

    return (
        <Box>
            <h1>Set vendor</h1>

            <Suspense fallback={<PickerSkeleton/>}>
                <VendorPickerUi values={vendors} value={value} setValue={selected => doSetValue(selected)}/>
            </Suspense>

            <TicketWizardActionBar onSubmit={submit} firstStep={true}/>
        </Box>
    )
}
