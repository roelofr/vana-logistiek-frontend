'use client';

import {Suspense, useMemo} from 'react'
import {District, DownloadingModelPicker} from "@/app/domain";
import PickerSkeleton from "@/app/ui/pickers/PickerSkeleton";
import {DistrictPickerUi} from "@/app/ui/pickers/DistrictPickerUi";
import LoadDistricts from "@/app/components/pickers/DistrictLoader";

export default function DistrictPicker(props: DownloadingModelPicker<District>) {
    const values = useMemo(() => props.values ?? LoadDistricts(), [props.values]);

    const realProps = {
        ...props,
        values,
    }

    return (
        <Suspense fallback={<PickerSkeleton/>}>
            <DistrictPickerUi {...realProps} />
        </Suspense>
    )
}
