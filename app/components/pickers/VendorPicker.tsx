import {Suspense} from 'react'
import VendorPickerUi from "@/app/ui/pickers/VendorPickerUi";
import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {Vendor} from "@/app/domain";

async function fetchVendors() {
    const session = await auth();

    if (session == null)
        throw new Error("Session not found");

    const api = new ApiStore(session);

    return await api.get<Vendor[]>('/vendor');
}

interface VendorPickerProps {
    vendors?: Promise<Vendor[]> | Vendor[];
}

export default function VendorPicker({vendors}: VendorPickerProps) {
    const actualVendors = vendors == null
        ? fetchVendors()
        : (vendors instanceof Promise
            ? vendors
            : Promise.resolve(vendors)
        );

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VendorPickerUi vendors={actualVendors}/>
        </Suspense>
    )
}
