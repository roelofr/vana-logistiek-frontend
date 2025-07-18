import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {PageContainer} from '@toolpad/core/PageContainer';
import {Vendor} from "@/app/domain";
import SkeletonTable from "@/app/components/skeletons/SkeletonTable";
import {Suspense} from "react";
import VendorTable from "@/app/ui/VendorTable";

export default function VendorPage() {
    // Lazy load the vendors, eventually.
    const vendors = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<Vendor[]>('/vendor'));

    const skeletonCols = [{
        title: 'Nummer',
        width: 100,
    }, {
        title: 'Naam',
        width: 300
    }, {
        title: 'Wijk',
        width: 60
    }]

    return (
        <PageContainer>
            <Suspense fallback={<SkeletonTable columns={skeletonCols}/>}>
                <VendorTable vendors={vendors}/>
            </Suspense>
        </PageContainer>
    )
}
