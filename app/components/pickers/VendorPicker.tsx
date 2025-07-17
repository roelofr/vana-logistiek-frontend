'use client';

import {Suspense} from 'react'
import {ModelPicker, Vendor} from "@/app/domain";
import {VendorPickerUi} from "@/app/ui/pickers/VendorPickerUi";
import PickerSkeleton from "@/app/ui/pickers/PickerSkeleton";

export default function VendorPicker(props: ModelPicker<Vendor>) {
    return (
        <Suspense fallback={<PickerSkeleton/>}>
            <VendorPickerUi {...props} />
        </Suspense>
    )
}
