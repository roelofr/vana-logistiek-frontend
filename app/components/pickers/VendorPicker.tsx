import {Suspense} from 'react'
import VendorPickerUi from "@/app/ui/pickers/VendorPickerUi";
import fetchVendors from "@/app/components/pickers/VendorFetcher";

export default function VendorPicker() {
    const vendors = fetchVendors();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VendorPickerUi vendors={vendors}/>
        </Suspense>
    )
}
