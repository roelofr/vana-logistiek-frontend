import {Suspense} from 'react'
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {Vendor} from "@/app/domain";
import VendorPickerUi from "@/app/ui/VendorPickerUi";

export default function VendorPicker() {
    // Don't await the data fetching function
    const vendors = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<Vendor[]>('/vendor'));

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VendorPickerUi vendors={vendors}/>
        </Suspense>
    )
}
